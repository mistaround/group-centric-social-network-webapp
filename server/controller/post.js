/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
// Import models
const Post = require("../model/post");
const Flag = require("../model/flag");
const Hide = require("../model/hide");
const UserGroup = require("../model/userGroup");
const Group = require("../model/group");
const User = require("../model/user");

// Import validation
const {
  createPostValidation,
  createFlagValidation,
  undoAllFlagsValidation,
  deleteFlagsValidation,
  enableHideValidation,
  deletePostValidation,
  getPostByGroupIdValidation,
} = require("../validation/postValidation");

const createPost = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    groupId: req.body.groupId,
    title: req.body.title,
    content: req.body.content,
    mediaUrl: req.body.mediaUrl,
    hasVideo: req.body.hasVideo,
    hasAudio: req.body.hasAudio,
  };
  const { error } = createPostValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Create a new post instance
  const post = new Post({
    userId: req.user._id,
    groupId: req.body.groupId,
    title: req.body.title,
    content: req.body.content,
    mediaUrl: req.body.mediaUrl,
    hasVideo: req.body.hasVideo,
    hasAudio: req.body.hasAudio,
  });

  // Try to save posts into database first
  let savedPost;
  try {
    savedPost = await post.save();
    await Group.updateOne({ _id: req.body.groupId }, { updatedDate: new Date() });
    return res.status(201).send({ success: true, data: savedPost });
  } catch (err) {
    return res.status(500).send({ success: false, msg: err });
  }
};

// Function for user to delete a post by the corresponding id
const deletePost = async (req, res) => {
  const dataToValidate = { id: req.params.id };
  const { error } = deletePostValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the post to be deleted is existed
  const postFetched = await Post.findOne({ _id: req.params.id });
  if (!postFetched) {
    return res
      .status(400)
      .send({ success: false, msg: "The post to be deleted is not existed" });
  }
  try {
    await Post.deleteOne({ _id: req.params.id });
    const group = await Group.findOne({ _id: postFetched.groupId });
    await Group.updateOne(
      { _id: postFetched.groupId },
      // eslint-disable-next-line comma-dangle
      { postDelNum: group.postDelNum + 1 }
    );
    return res
      .status(201)
      .send({ success: true, msg: "Delete post successful" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to delete the post" });
  }
};

const getPosts = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  try {
    // Compute the maximum page number we can reach currently
    const posts = await UserGroup.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "groupId",
          foreignField: "groupId",
          as: "post",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          post: 1,
          _id: 0,
        },
      },
      {
        $unwind: "$post",
      },
      {
        $lookup: {
          from: "groups",
          localField: "post.groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "userDocs",
        },
      },
      {
        $project: {
          "post.groupId": 0,
          "post.userId": 0,
          "userDocs.password": 0,
          "userDocs.email": 0,
          "userDocs.date": 0,
          "userDocs.locked": 0,
        },
      },
      {
        $match: {
          "userDocs.deactivated": false,
        },
      },
      {
        $lookup: {
          from: "hides",
          localField: "post._id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $match: {
          "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
        },
      },
    ]);

    const postNum = posts.length;
    let maxPageNum = 0;
    if (postNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(postNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(postNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: postNum });
    }

    // Fetch posts from database
    const postsFetched = await UserGroup.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "groupId",
          foreignField: "groupId",
          as: "post",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          post: 1,
          _id: 0,
        },
      },
      {
        $unwind: "$post",
      },
      {
        $lookup: {
          from: "groups",
          localField: "post.groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "userDocs",
        },
      },
      {
        $project: {
          "post.groupId": 0,
          "post.userId": 0,
          "userDocs.password": 0,
          "userDocs.email": 0,
          "userDocs.date": 0,
          "userDocs.locked": 0,
        },
      },
      {
        $match: {
          "userDocs.deactivated": false,
        },
      },
      {
        $lookup: {
          from: "hides",
          localField: "post._id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $match: {
          "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
        },
      },
      {
        $project: {
          hideDocs: 0,
        },
      },
      {
        $lookup: {
          from: "user_group",
          localField: "groupDocs._id",
          foreignField: "groupId",
          as: "status",
        },
      },
      {
        $project: {
          userDocs: 1,
          post: 1,
          groupDocs: 1,
          status: {
            $filter: {
              input: "$status",
              as: "item",
              cond: {
                $eq: ["$$item.userId", mongoose.Types.ObjectId(req.user._id)],
              },
            },
          },
        },
      },
    ])
      .sort({ "post.date": "desc" })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    // If no posts fetched
    if (!postsFetched) {
      return res.status(200).send({ success: true, data: [] });
    }
    return res
      .status(200)
      .send({ success: true, data: postsFetched, total: postNum });
  } catch (err) {
    res.status(400).send({ success: false, msg: "Invalid fetch" });
  }
};

// Function for user to flag a post
const createFlag = async (req, res) => {
  const dataToValidate = { userId: req.user._id, postId: req.params.id };
  const { error } = createFlagValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the postId provided exists
  const postExisted = await Post.findOne({ _id: req.params.id });
  if (!postExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Post provided does not exist" });
  }

  // Check if a flag with same userId and postId are already existed
  const flagExisted = await Flag.find({
    $and: [{ userId: req.user._id }, { postId: req.params.id }],
  });
  if (flagExisted.length !== 0) {
    return res.status(400).send({ success: false, msg: "Flag already exists" });
  }

  try {
    await Post.updateOne({ _id: req.params.id }, { flagged: true });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to mark this post as flagged" });
  }

  // Create a new flag instance
  const newFlag = new Flag({
    userId: req.user._id,
    postId: req.params.id,
  });
  try {
    const savedFlag = await newFlag.save();
    return res.status(201).send({ success: true, data: savedFlag });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to flag the post" });
  }
};

// Function for admin to undo all flags of a post
const undoAllFlags = async (req, res) => {
  const dataToValidate = { postId: req.params.id };
  const { error } = undoAllFlagsValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the postId provided exists
  const postExisted = await Post.findOne({ _id: req.params.id });
  if (!postExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Post provided does not exist" });
  }

  // Check if a flag with same userId and postId are already existed
  const flagExisted = await Flag.find({ postId: req.params.id });
  if (flagExisted.length === 0) {
    return res.status(400).send({ success: false, msg: "Flag does not exist" });
  }

  // Update the flag status in post collection
  try {
    await Post.updateOne({ _id: req.params.id }, { flagged: false });
    postExisted.flagged = false;
    res.status(201).send({ success: true, data: postExisted });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to undo the flag status" });
  }
};

// Function for admin to delete all flags of a post
const deleteFlags = async (req, res) => {
  const dataToValidate = { postId: req.params.id };
  const { error } = deleteFlagsValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the postId provided exists
  const postExisted = await Post.findOne({ _id: req.params.id });
  if (!postExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Post provided does not exist" });
  }

  // Check if a flag with same userId and postId are already existed
  const flagExisted = await Flag.find({ postId: req.params.id });
  if (flagExisted.length === 0) {
    return res.status(400).send({ success: false, msg: "Flag does not exist" });
  }

  // Delete corresponding flags in flag collection
  try {
    await Flag.deleteMany({ postId: req.params.id });
    res.status(201).send({ success: true, msg: "Delete Successful" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to delete the flags" });
  }
};

// Function for user to flag a post
const enableHide = async (req, res) => {
  const dataToValidate = { userId: req.user._id, postId: req.params.id };
  const { error } = enableHideValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the postId provided exists
  const postExisted = await Post.findOne({ _id: req.params.id });
  if (!postExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Post provided does not exist" });
  }

  // Check if a hide with same userId and postId are already existed
  const hideExisted = await Hide.find({
    $and: [{ userId: req.user._id }, { postId: req.params.id }],
  });
  if (hideExisted.length !== 0) {
    return res
      .status(400)
      .send({ success: false, msg: "This post has already been hide" });
  }

  // Create a new hide instance
  const newHide = new Hide({
    userId: req.user._id,
    postId: req.params.id,
  });
  try {
    const savedHide = await newHide.save();
    return res.status(201).send({ success: true, data: savedHide });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to hide the post" });
  }
};

const getPostByGroupId = async (req, res) => {
  const dataToValidate = { id: req.params.groupId };
  const { error } = getPostByGroupIdValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  try {
    const preQuery = await await Post.aggregate([
      {
        $lookup: {
          from: "hides",
          localField: "_id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDocs",
        },
      },
      {
        $match: {
          $and: [
            { groupId: mongoose.Types.ObjectId(req.params.groupId) },
            {
              "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
            },
            {
              "userDocs.deactivated": { $ne: true },
            },
          ],
        },
      },
      {
        $project: {
          hideDocs: 0,
          userDocs: 0,
        },
      },
    ]);
    let maxPageNum = 0;
    const postNum = preQuery.length;
    if (postNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(postNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(postNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: postNum });
    }

    const postsFetched = await Post.aggregate([
      {
        $lookup: {
          from: "hides",
          localField: "_id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDocs",
        },
      },
      {
        $match: {
          $and: [
            { groupId: mongoose.Types.ObjectId(req.params.groupId) },
            {
              "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
            },
            {
              "userDocs.deactivated": { $ne: true },
            },
          ],
        },
      },
      {
        $project: {
          hideDocs: 0,
          userDocs: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
    ])
      .sort({ date: "desc" })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));

    return res
      .status(200)
      .send({ success: true, data: postsFetched, total: postNum });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to posts of target group" });
  }
};

const getPostById = async (req, res) => {
  const dataToValidate = { id: req.params.id };
  const { error } = getPostByGroupIdValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  const post = await Post.findOne({ _id: req.params.id });
  if (!post) {
    return res.status(404).send({ success: false, msg: "Post cannot found" });
  }

  try {
    const user = await User.findOne({ _id: post.userId });

    if (user.deactivated) {
      return res
        .status(200)
        .send({ success: false, data: [], deactivated: true });
    }

    const response = await Post.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $unwind: "$groupDocs",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDocs",
        },
      },
      {
        $unwind: "$userDocs",
      },
      {
        $project: {
          userId: 0,
          groupId: 0,
        },
      },
    ]);

    return res
      .status(200)
      .send({ success: true, data: response, deactivated: false });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to fetch the post" });
  }
};

const checkHiddenStatus = async (req, res) => {
  const dataToValidate = { id: req.params.id };
  const { error } = getPostByGroupIdValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  try {
    const hideExisted = await Hide.findOne({
      $and: [{ postId: req.params.id }, { userId: req.user._id }],
    });
    if (hideExisted) {
      return res
        .status(200)
        .send({ success: true, data: hideExisted, exist: true });
    }
    return res.status(200).send({ success: true, exist: false });
  } catch (err) {
    return err;
  }
};

const getPostOfCurUser = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (user.deactivated) {
      return res.status(200).send({ success: true, data: [], total: 0 });
    }

    const preQuery = await Post.aggregate([
      {
        $lookup: {
          from: "hides",
          localField: "_id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $match: {
          $and: [
            { userId: { $eq: mongoose.Types.ObjectId(req.user._id) } },
            {
              "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
            },
          ],
        },
      },
    ]);

    const postNum = preQuery.length;

    if (postNum === 0) {
      return res.status(200).send({ success: true, data: [], total: postNum });
    }

    let maxPageNum = 0;
    if (postNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(postNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(postNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: postNum });
    }

    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "hides",
          localField: "_id",
          foreignField: "postId",
          as: "hideDocs",
        },
      },
      {
        $match: {
          $and: [
            { userId: { $eq: mongoose.Types.ObjectId(req.user._id) } },
            {
              "hideDocs.userId": { $ne: mongoose.Types.ObjectId(req.user._id) },
            },
          ],
        },
      },
      {
        $project: {
          hideDocs: 0,
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      { $unwind: "$groupDocs" },
    ])
      .sort({ date: "desc" })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));

    return res.status(200).send({ success: true, data: posts, total: postNum });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to fetch posts of target user" });
  }
};

module.exports = {
  createPost,
  getPosts,
  createFlag,
  undoAllFlags,
  deleteFlags,
  enableHide,
  deletePost,
  getPostByGroupId,
  getPostById,
  checkHiddenStatus,
  getPostOfCurUser,
};

/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
const mongoose = require("mongoose");
const Group = require("../model/group");
const Request = require("../model/request");
const User = require("../model/user");
const Post = require("../model/post");
const GroupTag = require("../model/groupTag");
const Flag = require("../model/flag");
const Hide = require("../model/hide");
const Tag = require("../model/tag");

// Import validation
const {
  createGroupValidation,
  joinGroupValidation,
  createRequestValidation,
  checkGroupStatusValidation,
  getRequestByUserIdAndGroupIdValidation,
  removeRequestValidation,
  quitGroupValidation,
  getGroupByIdValidation,
  checkUserGroupStatusValidation,
  checkupdateGroupInfoValidation,
} = require("../validation/groupValidation");

// Import functions to do with tags and group-tag collection
const { createTag } = require("./tag");
const { createGroupTag } = require("./groupTag");

// Import functions to do with user-group collection
const { createUserGroup } = require("./userGroup");
const UserGroup = require("../model/userGroup");

// Function for user to create a group
const createGroup = async (req, res) => {
  const dataToValidate = {
    owner: req.user._id,
    name: req.body.name,
    tags: req.body.tags,
    isPrivate: req.body.isPrivate,
  };
  const { error } = createGroupValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if a group with same name is already existed
  const groupExisted = await Group.findOne({ name: req.body.name });
  if (groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: `Group ${req.body.name} already exists` });
  }

  // Create a new group instance
  const group = new Group({
    owner: req.user._id,
    name: req.body.name,
    isPrivate: req.body.isPrivate,
    aboutGroup: req.body.aboutGroup,
  });

  try {
    // Save new group into database
    // eslint-disable-next-line prefer-const
    let savedGroup = await group.save();

    // Save owner-newGroup into corresponding collection
    const newUserGroup = new UserGroup({
      userId: req.user._id,
      groupId: savedGroup._id.valueOf(),
      isAdmin: true,
    });
    await newUserGroup.save();

    // Save new tags into database
    const savedTags = [];
    for (let i = 0; i < req.body.tags.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const savedTag = await createTag({ name: req.body.tags[i] });
      savedTags.push(savedTag);
    }

    // Save group-tag pair into database
    const groupTagsSaved = [];
    for (let i = 0; i < savedTags.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const savedGroupTag = await createGroupTag({
        groupId: savedGroup._id.valueOf(),
        tagId: savedTags[i]._id.valueOf(),
      });
      groupTagsSaved.push(savedGroupTag.tagId);
    }

    const result = { ...savedGroup._doc, tags: groupTagsSaved };

    return res.status(201).send({ success: true, data: result });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

// Function for user to get the info of public groups he / she has joined
const getPublicGroups = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  try {
    // Compute the maximum page number we can reach currently
    const preQuery = await UserGroup.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
          "groupDocs.isPrivate": false,
        },
      },
    ]);
    let maxPageNum = 0;
    const groupNum = preQuery.length;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }

    const allGroups = await UserGroup.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $lookup: {
          from: "group_tag",
          localField: "groupId",
          foreignField: "groupId",
          as: "tagDocs",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "tagDocs.tagId",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
          "groupDocs.isPrivate": false,
        },
      },
      {
        $project: {
          tagDocs: 0,
        },
      },
    ])
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));

    return res
      .status(200)
      .send({ success: true, data: allGroups, total: groupNum });
  } catch (err) {
    return res
      .status(404)
      .send({ success: false, msg: "Cannot fetch groups' info" });
  }
};

// Function for user to get the info of private groups he / she has joined
const getPrivateGroups = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  try {
    // Compute the maximum page number we can reach currently
    const preQuery = await UserGroup.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
          "groupDocs.isPrivate": true,
        },
      },
    ]);
    let maxPageNum = 0;
    const groupNum = preQuery.length;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }

    const allGroups = await UserGroup.aggregate([
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "groupDocs",
        },
      },
      {
        $lookup: {
          from: "group_tag",
          localField: "groupId",
          foreignField: "groupId",
          as: "tagDocs",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "tagDocs.tagId",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $match: {
          userId: mongoose.Types.ObjectId(req.user._id),
          "groupDocs.isPrivate": true,
        },
      },
      {
        $project: {
          tagDocs: 0,
        },
      },
    ])
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));

    return res
      .status(200)
      .send({ success: true, data: allGroups, total: groupNum });
  } catch (err) {
    return res
      .status(404)
      .send({ success: false, msg: "Cannot fetch groups' info" });
  }
};

// Function for user to get a specific group's info
const getGroupById = async (req, res) => {
  const dataToValidate = { id: req.params.id };
  const { error } = getGroupByIdValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Search for the info of the given group
  const groupFetched = await Group.findOne({ _id: req.params.id });
  if (!groupFetched) {
    return res
      .status(404)
      .send({ success: false, msg: "Cannot fetch the group" });
  }

  // If fetched group is private, check if user is permit to view the info of it
  if (groupFetched.isPrivate) {
    const permit = await UserGroup.findOne({
      $and: [{ userId: req.user._id }, { groupId: req.params.id }],
    });

    if (!permit) {
      return res.status(403).send({
        success: false,
        msg: "Not allowed to view this private group without join in",
      });
    }
  }

  try {
    // Search for tags of the given group
    const tagsFetched = await GroupTag.aggregate([
      {
        $lookup: {
          from: "tags",
          localField: "tagId",
          foreignField: "_id",
          as: "tagDocs",
        },
      },
      {
        $match: {
          groupId: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          tagDocs: 1,
          _id: 0,
        },
      },
    ]);

    // Compute the number of users in this group
    const userNum = await UserGroup.aggregate([
      {
        $match: {
          groupId: mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    // Compute the number of posts in this group
    const postNum = await Post.find({
      groupId: mongoose.Types.ObjectId(req.params.id),
    }).count();

    // Compute the number of flagged posts in this group
    const flagFetched = await Flag.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postDocs",
        },
      },
      {
        $match: {
          "postDocs.groupId": { $eq: mongoose.Types.ObjectId(req.params.id) },
        },
      },
    ]);

    // Compute the number of hidden posts in this group
    const hiddenFetched = await Hide.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "postDocs",
        },
      },
      {
        $match: {
          "postDocs.groupId": { $eq: mongoose.Types.ObjectId(req.params.id) },
        },
      },
    ]);

    // Concate tags and group
    const result = {
      ...groupFetched._doc,
      tags: tagsFetched,
      postNum,
      userNum: userNum.length,
      flagNum: flagFetched.length,
      hideNum: hiddenFetched.length,
    };
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    return res
      .status(404)
      .send({ success: false, msg: "Cannot fetch the group" });
  }
};

// Function for user to join a group after getting permit
const joinGroup = async (req, res) => {
  const { error } = joinGroupValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the target group is valid
  const groupExisted = await Group.findOne({ _id: req.body.groupId });
  if (!groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Group does not exist" });
  }

  try {
    const result = await createUserGroup(req.body);
    if (result.err) {
      return res.status(400).send({ success: false, msg: result.err });
    }
    res.status(201).send({ success: true, data: result });
  } catch (err) {
    res.status(400).send({ success: false, msg: err });
  }
};

// Function for user to quit a group
const quitGroup = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    groupId: req.params.id,
  };
  const { error } = quitGroupValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the groupId provided is valid
  const groupExisted = await Group.findOne({
    _id: req.params.id,
  });
  if (!groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Group does not exist" });
  }

  // Check if user is in the target group
  const joined = await UserGroup.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.id }],
  });

  if (!joined) {
    return res
      .status(400)
      .send({ success: false, msg: "User is not in the target group" });
  }

  // Check if user is the owner of the group
  if (groupExisted.owner === req.user._id) {
    return res
      .status(400)
      .send({ success: false, msg: "Owner cannot quit the group" });
  }

  // Delete corresponding item from user-group collection
  try {
    await UserGroup.deleteOne({
      $and: [{ userId: req.user._id }, { groupId: req.params.id }],
    });
    return res
      .status(201)
      .send({ success: true, msg: "Quit group successfully" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to quit the group" });
  }
};

// Function for user to create a join group request
const createRequest = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    groupId: req.params.id,
  };
  const { error } = createRequestValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the groupId provided is valid
  const groupExisted = await Group.findOne({
    _id: req.params.id,
  });
  if (!groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Group does not exist" });
  }

  // Check if user is in the target group
  const joined = await UserGroup.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.id }],
  });

  if (joined) {
    return res
      .status(400)
      .send({ success: false, msg: "User is already in the target group" });
  }

  // Check if there is already an active request
  const requestExisted = await Request.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.id }],
  });

  if (requestExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "User has requested to join the group" });
  }

  const newRequest = new Request({
    userId: req.user._id,
    groupId: req.params.id,
  });

  try {
    const savedRequest = await newRequest.save();
    return res.status(201).send({ success: true, data: savedRequest });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to send a request" });
  }
};

const getRequestByUserIdAndGroupId = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    groupId: req.params.groupId,
  };
  const { error } = getRequestByUserIdAndGroupIdValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  // Check if the groupId provided is valid
  const groupExisted = await Group.findOne({
    _id: req.params.groupId,
  });
  if (!groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Group does not exist" });
  }

  // Check if the userId provided is valid
  const userExisted = await User.findOne({
    _id: req.user._id,
  });
  if (!userExisted) {
    return res.status(400).send({ success: false, msg: "User does not exist" });
  }

  // Return the request fetched
  const requestFetched = await Request.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.groupId }],
  });

  if (requestFetched) {
    return res.status(200).send({ success: true, data: requestFetched });
  }
  return res
    .status(404)
    .send({ success: false, msg: "Failed to find the request" });
};

// Function for user to remove a join group request
const removeRequest = async (req, res) => {
  const dataToValidate = {
    userId: req.body.userId,
    groupId: req.body.groupId,
  };
  const { error } = removeRequestValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the groupId provided is valid
  const groupExisted = await Group.findOne({
    _id: req.body.groupId,
  });
  if (!groupExisted) {
    return res
      .status(404)
      .send({ success: false, msg: "Group does not exist" });
  }

  // Check if there is already an active request
  const requestExisted = await Request.findOne({
    $and: [{ userId: req.body.userId }, { groupId: req.body.groupId }],
  });

  if (!requestExisted) {
    return res
      .status(404)
      .send({ success: false, msg: "No active request exists" });
  }

  try {
    await Request.deleteOne({ _id: requestExisted._id });
    return res.status(201).send({ success: true, data: requestExisted });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to delete the request" });
  }
};

// Function to check if user has requested to join the group
const checkGroupStatus = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    groupId: req.params.id,
  };
  const { error } = checkGroupStatusValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the groupId provided is valid
  const groupExisted = await Group.findOne({
    _id: req.params.id,
  });
  if (!groupExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Group does not exist" });
  }

  // Check if user is in the group
  const joined = await UserGroup.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.id }],
  });

  if (joined) {
    return res
      .status(200)
      .send({ success: true, data: { joined: true, requested: false } });
  }

  // Check if there is already an active request
  const requestExisted = await Request.findOne({
    $and: [{ userId: req.user._id }, { groupId: req.params.id }],
  });

  if (requestExisted) {
    return res
      .status(200)
      .send({ success: true, data: { joined: false, requested: true } });
  }

  // If user neither request nor join the group
  return res
    .status(200)
    .send({ success: true, data: { joined: false, requested: false } });
};

// Function to sample a few groups randomly
const getTrendingGroups = async (req, res) => {
  try {
    const sampledGroups = await Group.aggregate([
      {
        $lookup: {
          from: "group_tag",
          localField: "_id",
          foreignField: "groupId",
          as: "tagDocs",
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "tagDocs.tagId",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $project: {
          tagDocs: 0,
        },
      },
      { $match: { isPrivate: false } },
      { $sample: { size: 5 } },
    ]);

    return res.status(200).send({ success: true, data: sampledGroups });
  } catch (err) {
    return res
      .status(404)
      .send({ success: false, data: "Cannot fetch groups" });
  }
};

const checkUserGroupStatus = async (req, res) => {
  const dataToValidate = {
    id: req.params.id,
  };
  const { error } = checkUserGroupStatusValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  try {
    const result = await UserGroup.findOne({
      userId: req.user._id,
      groupId: req.params.id,
    });
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    return res
      .status(404)
      .send({ success: false, msg: "Failed to fetch the status" });
  }
};

const validateGroupName = async (req, res) => {
  try {
    const groupFetched = await Group.findOne({ name: req.params.name });
    if (!groupFetched) {
      return res.status(200).send({
        success: true,
        msg: "Group name has not been occupied",
        occupied: false,
      });
    }
    return res.status(200).send({
      success: false,
      msg: "Group name has been occupied",
      data: groupFetched,
      occupied: true,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to find the group" });
  }
};

const updateGroupInfo = async (req, res) => {
  const { error } = checkupdateGroupInfoValidation(req.body);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  try {
    const groupInfo = await Group.findOne({ _id: req.params.id });
    if (!groupInfo) {
      return res.status(400).send({
        success: false,
        msg: "No such group",
      });
    }
    const avatarUrl =
      "avatarUrl" in req.body ? req.body.avatarUrl : groupInfo._doc.avatarUrl;
    const aboutGroup =
      "aboutGroup" in req.body
        ? req.body.aboutGroup
        : groupInfo._doc.aboutGroup;
    const postDelNum =
      "postDelNum" in req.body
        ? req.body.postDelNum
        : groupInfo._doc.postDelNum;
    const groupUpdated = await Group.updateOne(
      { _id: req.params.id },
      {
        aboutGroup,
        avatarUrl,
        postDelNum,
      }
    );
    if (!groupUpdated) {
      return res.status(400).send({
        success: false,
        msg: "Update Fail",
      });
    }
    return res.status(201).send({
      success: true,
      data: groupUpdated,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to find the group" });
  }
};

const getGroupSortTime = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    const groupNum = await Group.find({ isPrivate: false }).count();
    let maxPageNum = 0;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    // Fetch groups from database
    const groupsFetched = await Group.find({ isPrivate: false })
      .sort({ updatedDate: "desc" })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    // If no groups fetched
    if (!groupsFetched) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    return res
      .status(200)
      .send({ success: true, data: groupsFetched, total: groupNum });
  } catch (err) {
    return res.status(500).send({ success: false, msg: "Error" });
  }
};

const getGroupSortPost = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    // select * from
    // group left join
    // (select count(*) as num, groupid
    // from post
    // group by groupid) as post0
    // on group.groupid = post0.groupid
    // order by post0.num desc
    const PostNums = await Post.aggregate([
      {
        $group: {
          _id: "$groupId",
          count: { $sum: 1 },
        },
      },
    ]).sort({ count: "desc" });
    const sortedGroupIds = [];
    PostNums.forEach((item) => {
      sortedGroupIds.push(item._id);
    });
    const groupNum = await Group.find({
      $and: [{ _id: { $in: sortedGroupIds } }, { isPrivate: false }],
    }).count();
    let maxPageNum = 0;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    // Fetch groups from database
    const groupsFetched = await Group.find({
      $and: [{ _id: { $in: sortedGroupIds } }, { isPrivate: false }],
    })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    // If no groups fetched
    if (!groupsFetched) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    return res
      .status(200)
      .send({ success: true, data: groupsFetched, total: groupNum });
  } catch (err) {
    return res.status(500).send({ success: false, msg: "Error" });
  }
};

const getGroupSortMember = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }
  try {
    const MemberNums = await UserGroup.aggregate([
      {
        $group: {
          _id: "$groupId",
          count: { $sum: 1 },
        },
      },
    ]).sort({ count: "desc" });
    const sortedGroupIds = [];
    MemberNums.forEach((item) => {
      sortedGroupIds.push(item._id);
    });
    const groupNum = await Group.find({
      $and: [{ _id: { $in: sortedGroupIds } }, { isPrivate: false }],
    }).count();
    let maxPageNum = 0;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    // Fetch groups from database
    const groupsFetched = await Group.find({
      $and: [{ _id: { $in: sortedGroupIds } }, { isPrivate: false }],
    })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    // If no groups fetched
    if (!groupsFetched) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }
    return res
      .status(200)
      .send({ success: true, data: groupsFetched, total: groupNum });
  } catch (err) {
    return res.status(500).send({ success: false, msg: "Error" });
  }
};

const getAllTags = async (req, res) => {
  try {
    const response = await Tag.find({});
    res.status(200).send({ success: true, data: response });
  } catch (err) {
    res.status(500).send({ success: false, msg: "Failed to fetch tag data" });
  }
};

const getGroupByTag = async (req, res) => {
  // Setting default limit and skip to 5 and 1 - pageSize and currentPage
  if (req.query.limit === undefined || req.query.limit <= 0) {
    req.query.limit = 5;
  }
  if (req.query.skip === undefined || req.query.skip <= 0) {
    req.query.skip = 1;
  }

  const dataToValidate = {
    id: req.params.id,
  };
  const { error } = checkUserGroupStatusValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }

  try {
    const preQuery = await GroupTag.aggregate([
      {
        $match: {
          tagId: mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    const groupNum = preQuery.length;
    let maxPageNum = 0;
    if (groupNum % req.query.limit !== 0) {
      maxPageNum = Math.floor(groupNum / req.query.limit) + 1;
    } else {
      maxPageNum = Math.floor(groupNum / req.query.limit);
    }
    // if the parameter skip exceeds the maximum page number currently we can reach
    // set the response to be empty
    if (req.query.skip > maxPageNum) {
      return res.status(200).send({ success: true, data: [], total: groupNum });
    }

    const groups = await GroupTag.aggregate([
      {
        $match: {
          tagId: mongoose.Types.ObjectId(req.params.id),
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
      {
        $lookup: {
          from: "tags",
          localField: "tagId",
          foreignField: "_id",
          as: "tagDocs",
        },
      },
      {
        $project: {
          _id: 0,
          tagId: 0,
          groupId: 0,
        },
      },
      { $unwind: "$tagDocs" },
    ])
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    const result = [];
    groups.forEach((item) => {
      if (!item.groupDocs.isPrivate) {
        result.push({
          ...item.groupDocs,
          tagId: item.tagDocs._id,
          tagName: item.tagDocs.name,
        });
      }
    });
    return res
      .status(200)
      .send({ success: true, data: result, total: groupNum });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, msg: "Failed to fetch target groups" });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  createRequest,
  checkGroupStatus,
  getRequestByUserIdAndGroupId,
  removeRequest,
  quitGroup,
  getPublicGroups,
  getPrivateGroups,
  getGroupById,
  getTrendingGroups,
  checkUserGroupStatus,
  validateGroupName,
  updateGroupInfo,
  getGroupSortTime,
  getGroupSortPost,
  getGroupSortMember,
  getAllTags,
  getGroupByTag,
};

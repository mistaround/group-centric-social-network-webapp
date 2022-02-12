/* eslint-disable comma-dangle */
// Import Comment Model
const Comment = require("../model/comment");
const User = require("../model/user");

// Import Validation
const {
  createCommentValidation,
  getCommentsValidation,
  updateCommentValidation,
  deleteCommentValidation,
} = require("../validation/commentValidation");

const createComment = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    postId: req.body.postId,
    content: req.body.content,
  };
  const { error } = createCommentValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Create a new post instance
  const comment = new Comment({
    userId: req.user._id,
    postId: req.body.postId,
    content: req.body.content,
  });
  try {
    const savedComment = await comment.save();
    return res.status(201).send({ success: true, data: savedComment });
  } catch (err) {
    return res.status(400).send({ success: false, msg: err });
  }
};

const getComments = async (req, res) => {
  const dataToValidate = { postId: req.params.id };
  const { error } = getCommentsValidation(dataToValidate);
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
  const commentNum = await Comment.find({ postId: req.params.id }).count();
  let maxPageNum = 0;
  if (commentNum % req.query.limit !== 0) {
    maxPageNum = Math.floor(commentNum / req.query.limit) + 1;
  } else {
    maxPageNum = Math.floor(commentNum / req.query.limit);
  }
  // if the parameter skip exceeds the maximum page number currently we can reach
  // set the response to be empty
  if (req.query.skip > maxPageNum) {
    return res.status(200).send({ success: true, data: [], total: commentNum });
  }
  try {
    // Fetch posts from database
    const commentsFetched = await Comment.find({ postId: req.params.id })
      .sort({ date: "desc" })
      .skip(Number(req.query.skip - 1) * Number(req.query.limit))
      .limit(Number(req.query.limit));
    // If no posts fetched
    if (!commentsFetched) {
      return res
        .status(200)
        .send({ success: true, data: [], total: commentNum });
    }
    const userIds = [];
    commentsFetched.forEach((item) => {
      userIds.push(item.userId);
    });
    const users = await User.find({ _id: { $in: userIds } });
    for (let i = 0; i < commentsFetched.length; i += 1) {
      for (let j = 0; j < users.length; j += 1) {
        if (commentsFetched[i].userId.valueOf() === users[j]._id.valueOf()) {
          commentsFetched[i] = {
            ...commentsFetched[i]._doc,
            avatarUrl: users[j].avatarUrl,
          };
          break;
        }
      }
    }
    return res
      .status(200)
      .send({ success: true, data: commentsFetched, total: commentNum });
  } catch (err) {
    res.status(400).send({ success: false, msg: "Invalid fetch" });
  }
};

const updateComment = async (req, res) => {
  const dataToValidate = {
    userId: req.user._id,
    commentId: req.params.id,
    content: req.body.content,
  };
  const { error } = updateCommentValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the commentId provided exists
  const commentExisted = await Comment.findOne({ _id: req.params.id });
  if (!commentExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Comment provided does not exist" });
  }
  // Update corresponding comment in comment collection
  try {
    if (req.user._id !== commentExisted.userId.valueOf()) {
      return res
        .status(401)
        .send({ success: false, msg: "Not authorized to mofify" });
    }
    await Comment.updateOne(
      { _id: req.params.id },
      { content: req.body.content }
    );
    res.status(201).send({ success: true, msg: "Update Successfully" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to delete the comment" });
  }
};

const deleteComment = async (req, res) => {
  const dataToValidate = { userId: req.user._id, commentId: req.params.id };
  const { error } = deleteCommentValidation(dataToValidate);
  if (error) {
    return res
      .status(400)
      .send({ success: false, msg: error.details[0].message });
  }
  // Check if the commentId provided exists
  const commentExisted = await Comment.findOne({ _id: req.params.id });
  if (!commentExisted) {
    return res
      .status(400)
      .send({ success: false, msg: "Comment provided does not exist" });
  }
  // Delete corresponding comment in comment collection
  try {
    if (req.user._id !== commentExisted.userId.valueOf()) {
      return res
        .status(401)
        .send({ success: false, msg: "Not authorized to delete" });
    }
    await Comment.deleteOne({ _id: req.params.id });
    res.status(201).send({ success: true, msg: "Delete Successfully" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, msg: "Failed to delete the comment" });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};

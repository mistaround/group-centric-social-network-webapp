const mongoose = require("./db");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  postId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  content: {
    type: String,
    min: 0,
    max: 2048,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema, "comments");

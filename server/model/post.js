const mongoose = require("./db");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  groupId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  title: {
    type: String,
    min: 1,
    max: 128,
    required: true,
  },
  content: {
    type: String,
    min: 0,
    max: 2048,
    default: "",
  },
  mediaUrl: {
    type: Array,
    default: [],
  },
  hasVideo: {
    type: Boolean,
  },
  hasAudio: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  toRemove: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Post", postSchema, "posts");

const mongoose = require("./db");

const groupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 5,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    min: 5,
    max: 30,
  },
  isPrivate: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avatarUrl: {
    type: String,
    default: "https://shareyou-file-server.s3.amazonaws.com/1639111728324.jpeg",
  },
  aboutGroup: {
    type: String,
    min: 0,
    max: 2048,
    default: "",
  },
  postDelNum: {
    type: Number,
    default: 0,
  },
  updatedDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Group", groupSchema, "groups");

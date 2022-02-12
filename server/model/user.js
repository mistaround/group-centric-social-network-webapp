const mongoose = require("./db");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avatarUrl: {
    type: String,
    default: "https://shareyou-file-server.s3.amazonaws.com/1639111728324.jpeg",
  },
  attempts: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  lockTime: {
    type: Date,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  deactivated: {
    type: Boolean,
    default: false,
  },
  hasNewMessage: {
    type: Boolean,
    default: false,
  },
  hasNewNotification: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema, "users");

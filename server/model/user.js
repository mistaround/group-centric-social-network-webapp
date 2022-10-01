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
    default: "https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg",
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

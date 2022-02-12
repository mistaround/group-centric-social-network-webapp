const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
  // readBySender: {
  //   type: Boolean,
  //   required: true,
  //   default: true,
  // },
  // readByReceiver: {
  //   type: Boolean,
  //   required: true,
  //   default: true,
  // },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", ChatSchema, "chats");

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    min: 24,
    max: 24,
  },
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
  text: {
    type: String,
    min: 0,
    max: 2048,
    default: "",
  },
  type: {
    type: String,
    min: 4,
    max: 7,
    default: "text",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema, "messages");

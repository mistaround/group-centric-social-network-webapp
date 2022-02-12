const mongoose = require("./db");

const requestSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema, "requests");

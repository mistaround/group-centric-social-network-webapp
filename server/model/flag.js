const mongoose = require("./db");

const flagSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Flag", flagSchema, "flags");

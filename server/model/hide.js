const mongoose = require("./db");

const hideSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Hide", hideSchema, "hides");

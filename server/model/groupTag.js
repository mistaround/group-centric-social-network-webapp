const mongoose = require("./db");

const groupTagSchema = new mongoose.Schema({
  tagId: {
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
});

module.exports = mongoose.model("Group_Tag", groupTagSchema, "group_tag");

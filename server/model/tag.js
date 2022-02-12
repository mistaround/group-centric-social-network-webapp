const mongoose = require("./db");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 30,
  },
});

module.exports = mongoose.model("Tag", tagSchema, "tags");

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to database
// eslint-disable-next-line consistent-return
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, (error) => {
  if (error) {
    return error;
  }
});

module.exports = mongoose;

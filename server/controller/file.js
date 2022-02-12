const util = require("util");
const fs = require("fs");
const { uploadFile } = require("./s3");

const unlinkFile = util.promisify(fs.unlink);

// Function for user to upload a single file from the frontend to express server
const fileUpload = async (req, res) => {
  // Upload files to express server
  const { file } = req;
  try {
    const result = await uploadFile(file);

    // Delete files on express server
    await unlinkFile(file.path);
    res
      .status(201)
      .send({ success: true, data: result, msg: "File upload successful" });
  } catch (err) {
    return res
      .status(400)
      .send({ success: false, err, msg: "File upload failed" });
  }
};

module.exports = { fileUpload };

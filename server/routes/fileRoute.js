const router = require("express").Router();
const multer = require("multer");
const { verifyToken } = require("../controller/auth");

// multer
// multer configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `/${__dirname}../../../public/uploads`);
  },
  filename(req, file, cb) {
    const fileFormat = file.originalname.split("."); // Split by '.', the file extension is at the end of array
    cb(null, `${Date.now()}.${fileFormat[fileFormat.length - 1]}`);
  },
});
// Add configuration to multer object
const upload = multer({
  storage,
});

// File controller
const { fileUpload } = require("../controller/file");

router.post("/", [upload.single("file"), verifyToken], fileUpload);

module.exports = router;

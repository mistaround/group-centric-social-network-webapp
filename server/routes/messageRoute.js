const router = require("express").Router();
const { createMessage, getMessages } = require("../controller/message");

router.post("/", createMessage);
router.get("/:id", getMessages);

module.exports = router;

const router = require("express").Router();
const {
  createChat,
  getSameGroup,
  getChat,
  getChats,
  // deleteChat,
} = require("../controller/chat");

router.post("/", createChat);
// get chat between current user and user with id
router.get("/same/:id", getSameGroup);
// get chat between current user and user with id
router.get("/:id", getChat);
// get all chats of current user
router.get("/", getChats);
// router.delete("/:id1/:id2", deleteChat);

module.exports = router;

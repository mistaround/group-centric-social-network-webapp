const router = require("express").Router();
const {
  createPost,
  getPosts,
  createFlag,
  undoAllFlags,
  deleteFlags,
  enableHide,
  deletePost,
  getPostByGroupId,
  getPostById,
  checkHiddenStatus,
  getPostOfCurUser,
} = require("../controller/post");

router.post("/", createPost);
router.get("/", getPosts);
router.get("/user", getPostOfCurUser);
router.get("/single/:id", getPostById);
router.get("/:groupId", getPostByGroupId);
router.delete("/:id", deletePost);
router.post("/flag/:id", createFlag);
router.put("/flag/:id", undoAllFlags);
router.delete("/flag/:id", deleteFlags);
router.post("/hide/:id", enableHide);
router.get("/hide/:id", checkHiddenStatus);

module.exports = router;

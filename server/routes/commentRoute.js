const router = require("express").Router();
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controller/comment");

router.post("/", createComment);
// get comments with postId
router.get("/:id", getComments);
// update comment with commentId
router.put("/:id", updateComment);
// delete the comment with commentId
router.delete("/:id", deleteComment);

module.exports = router;

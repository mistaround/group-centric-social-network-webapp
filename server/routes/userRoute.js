const router = require("express").Router();
const {
  getUserById,
  getCurrentUserInfo,
  validateUsername,
  updateUserById,
  validatePassword,
  getUsersByGroupId,
  promoteUser,
  demoteUser,
  searchUserByName,
} = require("../controller/user");

const { verifyToken } = require("../controller/auth");

router.get("/", verifyToken, getCurrentUserInfo);
router.get("/group/:id", verifyToken, getUsersByGroupId);
router.get("/validate/:name", validateUsername);
router.get("/search/:name", searchUserByName);
router.get("/validate_pwd/:password", verifyToken, validatePassword);
router.get("/:id", verifyToken, getUserById);
router.put("/admin/promote", verifyToken, promoteUser);
router.put("/admin/demote", verifyToken, demoteUser);
router.put("/:id", verifyToken, updateUserById);
module.exports = router;

const router = require("express").Router();
const {
  createGroup,
  joinGroup,
  createRequest,
  checkGroupStatus,
  getRequestByUserIdAndGroupId,
  removeRequest,
  quitGroup,
  getPublicGroups,
  getPrivateGroups,
  getGroupById,
  getTrendingGroups,
  checkUserGroupStatus,
  validateGroupName,
  updateGroupInfo,
  getGroupSortTime,
  getGroupSortPost,
  getGroupSortMember,
  getAllTags,
  getGroupByTag,
} = require("../controller/group");

router.post("/", createGroup);
router.get("/trend", getTrendingGroups);
router.get("/public", getPublicGroups);
router.get("/private", getPrivateGroups);
router.get("/all_tags", getAllTags);
router.get("/tag/:id", getGroupByTag);
// Sort group by several ways
router.get("/time", getGroupSortTime);
router.get("/post", getGroupSortPost);
router.get("/member", getGroupSortMember);

router.get("/status/:id", checkGroupStatus);
router.get("/user_group/:id", checkUserGroupStatus);
router.post("/join", joinGroup);
router.delete("/quit/:id", quitGroup);

router.get("/request/:groupId", getRequestByUserIdAndGroupId);
router.post("/request/:id", createRequest);
router.delete("/request", removeRequest);
router.get("/:id", getGroupById);
router.get("/validate/:name", validateGroupName);

router.put("/:id", updateGroupInfo);

module.exports = router;

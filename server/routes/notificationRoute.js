const router = require("express").Router();
const {
  createNotification,
  getNotifications,
  processAdmins,
  processClickOneForAll,
  processNotification,
  deleteNotification,
} = require("../controller/notification");

router.post("/", createNotification);
router.get("/", getNotifications);
router.put("/admin", processAdmins);
router.put("/click", processClickOneForAll);
router.put("/:id", processNotification);
router.delete("/:id", deleteNotification);

module.exports = router;

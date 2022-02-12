const router = require("express").Router();

// Import controller
const { userRegister, userLogin } = require("../controller/auth");

router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;

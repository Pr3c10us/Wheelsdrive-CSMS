const router = require("express").Router();

const { signup, verifyCode, sendCode,login } = require("../controllers/userAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verifyCode", verifyCode);
router.get("/sendCode", sendCode);

module.exports = router;

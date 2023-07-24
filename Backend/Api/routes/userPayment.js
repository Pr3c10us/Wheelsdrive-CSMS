// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const { userAuthorization } = require("../middlewares/adminAuthorization.js");

// Import modules
const { order, verifyPayment } = require("../controllers/userPayment");

//   Create payment routes
router.route("/order").post(userAuthorization, order);
router.route("/verify").post(userAuthorization, verifyPayment);

// Export payment routes
module.exports = router;
// Import Router
const router = require("express").Router();

// Import Admin Controller
const { adminSignUp, adminLogIn, logout } = require("../controllers/adminAuth");

// Create Admin Routes
router.route("/signup").post(adminSignUp);
router.route("/login").post(adminLogIn);
router.route("/logout").get(logout);

// Export Admin Routes
module.exports = router;

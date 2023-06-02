// Import router
const router = require("express").Router();

// Import adminAuthorization middleware
const adminAuthorization = require("../middlewares/adminAuthorization.js");

// Import ChargePoint model
const { getSessions } = require("../controllers/sessions.js");

// Create Update route
router
    .route("/")
    .get(adminAuthorization, getSessions)

module.exports = router;

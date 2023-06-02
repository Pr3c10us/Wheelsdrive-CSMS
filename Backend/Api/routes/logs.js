// Import router
const router = require("express").Router();

// Import adminAuthorization middleware
const adminAuthorization = require("../middlewares/adminAuthorization.js");

// Import ChargePoint model
const { getLogs } = require("../controllers/logs.js");

// Create Update route
router
    .route("/")
    .get(adminAuthorization, getLogs)

module.exports = router;

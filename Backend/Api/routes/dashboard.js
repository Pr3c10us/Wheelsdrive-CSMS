// Import router
const router = require("express").Router();

// Import adminAuthorization middleware
const { adminAuthorization } = require("../middlewares/adminAuthorization.js");

// Import ChargePoint model
const {
    revenue,
    totalTransaction,
    power,
    otherDashboardData,
} = require("../controllers/dashboard.js");

// Create Update route
router.route("/").get(adminAuthorization, otherDashboardData);
router.route("/revenue").get(adminAuthorization, revenue);
router.route("/totalTransaction").get(adminAuthorization, totalTransaction);
router.route("/power").get(adminAuthorization, power);

module.exports = router;

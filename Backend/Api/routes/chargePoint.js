// Import router
const router = require("express").Router();

// Import adminAuthorization middleware
const {adminAuthorization} = require("../middlewares/adminAuthorization.js");

// Import ChargePoint model
const {
    createChargePoint,
    getChargePoints,
    getChargePoint,
    updateChargePoint,
    deleteChargePoint,
} = require("../controllers/chargePoint.js");

// Create ChargePoint routes

router
    .route("/")
    .post(adminAuthorization, createChargePoint)
    .get(adminAuthorization, getChargePoints);

router
    .route("/:id")
    .get(adminAuthorization, getChargePoint)
    .put(adminAuthorization, updateChargePoint)
    .delete(adminAuthorization, deleteChargePoint);

// Export router
module.exports = router;

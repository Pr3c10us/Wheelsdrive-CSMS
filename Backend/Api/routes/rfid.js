// Import router
const router = require("express").Router();

// Import rfid controllers
const {
    createRFID,
    getRFIDs,
    updateRFID,
    deleteRFID,
} = require("../controllers/rfid");

// Import adminAuthorization middleware
const {adminAuthorization} = require("../middlewares/adminAuthorization.js");

// Create rfid routes

router
    .route("/")
    .post(adminAuthorization, createRFID)
    .get(adminAuthorization, getRFIDs);

router
    .route("/:id")
    .put(adminAuthorization, updateRFID)
    .delete(adminAuthorization, deleteRFID);

// Export router
module.exports = router;

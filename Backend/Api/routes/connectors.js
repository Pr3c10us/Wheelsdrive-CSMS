// Import router
const router = require("express").Router();

// Import adminAuthorization middleware
const {adminAuthorization} = require("../middlewares/adminAuthorization.js");

// Import ChargePoint model
const {
    updateConnector,
    getConnectorInfo,
} = require("../controllers/connectors.js");

// Create Update route
router
    .route("/:id")
    .get(adminAuthorization, getConnectorInfo)
    .put(adminAuthorization, updateConnector);

module.exports = router;

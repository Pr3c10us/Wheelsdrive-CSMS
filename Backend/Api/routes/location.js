// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const adminAuthorization = require("../middlewares/adminAuthorization.js");

// Import modules
const {
    createLocation,
    adminLocations,
    getLocations,
    getAdminLocation,
    getLocation,
    updateLocation,
    deleteLocation,
} = require("../controllers/location");

// Create location routes (ADMIN ONLY)
router
    .route("/admin")
    .get(adminAuthorization, adminLocations)
    .post(adminAuthorization, createLocation);
router
    .route("/admin/:id")
    .get(adminAuthorization, getAdminLocation)
    .put(adminAuthorization, updateLocation)
    .delete(adminAuthorization, deleteLocation);

//   Create location routes (ALL)
router.route("/general").get(getLocations);
router.route("/general/:id").get(getLocation);

// Export location routes
module.exports = router;

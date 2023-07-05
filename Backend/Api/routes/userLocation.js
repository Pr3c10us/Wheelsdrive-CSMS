// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const { userAuthorization } = require("../middlewares/adminAuthorization.js");

// Import modules
const { getLocations, getLocation } = require("../controllers/userLocation");

//   Create location routes
router.route("/").get(userAuthorization, getLocations);
router.route("/:id").get(userAuthorization, getLocation);

// Export location routes
module.exports = router;

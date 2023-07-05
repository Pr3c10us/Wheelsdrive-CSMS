// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const {adminAuthorization} = require("../middlewares/adminAuthorization.js");

// Import adminDetails controller
const { getAdminDetails } = require("../controllers/adminDetails.js");

router.route("/").get(adminAuthorization, getAdminDetails);

module.exports = router;

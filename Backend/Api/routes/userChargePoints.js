// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const { userAuthorization } = require("../middlewares/adminAuthorization.js");

// Import modules
const {
    getAllChargePoints,
    getChargePoints,
} = require("../controllers/userChargePoints.js");

//   Create ChargePoints routes
router.route("/:locationId").get(userAuthorization, getAllChargePoints);
router.route("/single/:id").get(userAuthorization, getChargePoints);

// Export ChargePoints routes
module.exports = router;

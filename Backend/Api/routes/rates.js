// Import Router
const router = require("express").Router();

// Import adminAuthorization middleware
const {adminAuthorization} = require("../middlewares/adminAuthorization.js");

// Import Rate controller
const {
    createRate,
    getRates,
    updateRate,
    deleteRate,
} = require("../controllers/rates.js");

// Create a new rate
router
    .route("/")
    .post(adminAuthorization, createRate)
    .get(adminAuthorization, getRates);

router
    .route("/:id")
    .put(adminAuthorization, updateRate)
    .delete(adminAuthorization, deleteRate);

// Export router
module.exports = router;

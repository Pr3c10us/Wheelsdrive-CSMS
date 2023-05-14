// Import router
const router = require("express").Router();

// Import apiUser controllers
const {
    createApiUser,
    getApiUsers,
    updateApiUser,
    deleteApiUser,
} = require("../controllers/apiUser");

// Import adminAuthorization middleware
const adminAuthorization = require("../middlewares/adminAuthorization.js");

// Create apiUser routes

router
    .route("/")
    .post(adminAuthorization, createApiUser)
    .get(adminAuthorization, getApiUsers);

router
    .route("/:id")
    .put(adminAuthorization, updateApiUser)
    .delete(adminAuthorization, deleteApiUser);

// Export router
module.exports = router;

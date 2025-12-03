const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const router = express.Router();

console.log("registerUser:", registerUser);
console.log("loginUser:", loginUser);

// POST /api/users/register
router.post("/register", registerUser);

// Post /api/users/login
router.post("/login", loginUser);

// Get user profile
const protect = require("../middleware/authMiddleware");
router.get("/profile", protect, getUserProfile);

module.exports = router;

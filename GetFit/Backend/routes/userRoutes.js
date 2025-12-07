const express = require("express");
const { registerUser, loginUser, getUserProfile, incrementVisits } = require("../controllers/userController");
const router = express.Router();

// Get user profile
const protect = require("../middleware/authMiddleware");

console.log("registerUser:", registerUser);
console.log("loginUser:", loginUser);

// POST /api/users/register
router.post("/register", registerUser);

// Post /api/users/login
router.post("/login", loginUser);

// Post /api/users/visits
router.put("/visits", protect, incrementVisits);



router.get("/profile", protect, getUserProfile);

module.exports = router;

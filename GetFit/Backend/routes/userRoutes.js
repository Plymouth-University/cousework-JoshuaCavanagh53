const express = require("express");
const { registerUser } = require("../controllers/userController");
const {loginUser} = require("../controllers/userController");
const router = express.Router();

// POST /api/users/register
router.post("/register", registerUser);

// Post /api/users/login
router.post("/login", loginUser);

module.exports = router;

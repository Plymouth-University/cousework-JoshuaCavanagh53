const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", req.body);

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // Case-insensitive search
    const user = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      visits: user.visits || 0,
      visitHistory: user.visitHistory || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get username and email for the logged-in user
const getUsernameEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("username email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment visits for the logged-in user
const incrementVisits = async (req, res) => {
  try {
    console.log("req.user:", req.user); 
    const user = await User.findById(req.user); 
    if (!user) return res.status(404).json({ message: "User not found" });

    user.visits = (user.visits || 0) + 1;
    user.visitHistory.push({ date: new Date() });

    await user.save();

    res.json({
      visits: user.visits,
      visitHistory: user.visitHistory,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
  getUsernameEmail,
  incrementVisits,
};

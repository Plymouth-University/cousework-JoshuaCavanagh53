const express = require("express");
const router = express.Router();
const { addWeightEntry, addLiftEntry, getWeightEntries } = require("../controllers/weightLiftController");

const protect = require("../middleware/authMiddleware");

router.post("/weights", protect, addWeightEntry);

router.post("/lifts", protect, addLiftEntry);

router.get("/weights", protect, getWeightEntries);
module.exports = router;
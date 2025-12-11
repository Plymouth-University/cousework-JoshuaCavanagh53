const express = require("express");
const router = express.Router();
const { addWeightEntry, addLiftEntry, getWeightEntries, getLiftEntries, updateLiftEntry } = require("../controllers/weightLiftController");

const protect = require("../middleware/authMiddleware");

router.post("/weights", protect, addWeightEntry);

router.post("/lifts", protect, addLiftEntry);

router.put("/lifts/:liftId", protect, updateLiftEntry);

router.get("/lifts", protect, getLiftEntries);

router.get("/weights", protect, getWeightEntries);
module.exports = router;
const Weight = require("../models/weight");
const Lift = require("../models/lift");
const User = require("../models/User");

// Weight
exports.addWeightEntry = async (req, res) => {
  const { date, weightKg, targetKg } = req.body;

  try {
    
    const weightEntry = await Weight.create({
      userId: req.user,   
      date,
      weightKg,
      targetKg,
    });

    const user = await User.findById(req.user).select("username");

    // Emit WebSocket event
    req.io.emit("weightUpdated", {
      userId: req.user,
      username: user.username,
      weightKg,
      targetKg,
      date,
    });
    
    res
      .status(201)
      .json({ weightEntry, message: "Weight entry added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lift
exports.addLiftEntry = async (req, res) => {
  const { exercise, date, sets, targetSets } = req.body;

  try {
    const liftEntry = await Lift.create({
      userId: req.user,   
      exercise,
      date,
      sets,
      targetSets,
    });
    res
      .status(201)
      .json({ liftEntry, message: "Lift entry added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWeightEntries = async (req, res) => {
  try {
    const weights = await Weight.find({ userId: req.user }).sort({ date: -1 });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

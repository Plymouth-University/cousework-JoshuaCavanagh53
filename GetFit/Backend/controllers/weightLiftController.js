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

exports.updateLiftEntry = async (req, res) => {
  const { liftId } = req.params;
  const { exercise, date, sets, targetSets } = req.body;

  try {
    // Find the lift entry belonging to this user
    const liftEntry = await Lift.findOne({ _id: liftId, userId: req.user });
    if (!liftEntry) {
      return res.status(404).json({ message: "Lift entry not found" });
    }

    // Update only the provided fields
    if (exercise) liftEntry.exercise = exercise;
    if (date) liftEntry.date = date;
    if (sets) liftEntry.sets = sets;
    if (targetSets) liftEntry.targetSets = targetSets;

    await liftEntry.save();

    // Emit WebSocket event
    req.io.emit("liftUpdated", {
      userId: req.user,
      liftId: liftEntry._id,
      exercise: liftEntry.exercise,
      sets: liftEntry.sets,
      targetSets: liftEntry.targetSets,
    });

    res.json({ message: "Lift entry updated successfully", liftEntry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLiftEntries = async (req, res) => {
  try {
    const lifts = await Lift.find({ userId: req.user }).sort({ date: -1 });
    res.json(lifts);
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

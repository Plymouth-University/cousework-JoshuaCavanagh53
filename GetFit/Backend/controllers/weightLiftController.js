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

      history: [
        {
          date: date || new Date(),
          weightKg: sets?.[0]?.weightKg,
          reps: sets?.[0]?.reps,
        },
      ],
    });

    res
      .status(201)
      .json({ liftEntry, message: "Lift entry added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateLiftEntry = async (req, res) => {
  try {
    const lift = await Lift.findById(req.params.liftId); 
    if (!lift) return res.status(404).json({ message: "Lift not found" });

    lift.history.push({
      date: new Date(),
      weightKg: req.body.sets[0]?.weightKg,
      reps: req.body.sets[0]?.reps,
    });

    lift.sets = req.body.sets;
    lift.targetSets = req.body.targetSets;
    lift.exercise = req.body.exercise;

    const updatedLift = await lift.save();
    res.json(updatedLift);
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

const mongoose = require("mongoose");

const liftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercise: { type: String, required: true },
  sets: [
    { reps: Number, weightKg: Number }
  ],
  targetSets: [
    { reps: Number, weightKg: Number }
  ],
  history: [
    {
      date: { type: Date, default: Date.now },
      weightKg: Number,
      reps: Number,
    }
  ]
});


module.exports = mongoose.model("Lift", liftSchema);

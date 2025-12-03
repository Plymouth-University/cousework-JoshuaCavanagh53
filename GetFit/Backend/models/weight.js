const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  weightKg: { type: Number, required: true },
  targetKg: { type: Number },
});


module.exports = mongoose.model("Weight", weightSchema);
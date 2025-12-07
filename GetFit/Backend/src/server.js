const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const userRoutes = require("../routes/userRoutes.js");

const weightLiftRoutes = require("../routes/weightLiftRoutes.js")

const app = express();


app.use(cors({ origin: "http://localhost:3000" }));

// Middleware to parse JSON
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api", weightLiftRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch(err => console.error(err));

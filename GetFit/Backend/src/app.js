const express = require("express");
const cors = require("cors");

const userRoutes = require("../routes/userRoutes.js");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use("/api/users", userRoutes);

module.exports = app;

// Load environment variables from .env file
require("dotenv").config({ path: "../../.env" });

// test/integration/userController.test.js
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Global variables for use in tests
let mongoServer;
let app;
let testMongoose;
let User;
let Weight;

// Setup before all tests
beforeAll(async () => {
  console.log("Setting up test environment...");

  // Check for JWT_SECRET
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "test-secret-key-12345";
    console.log("JWT_SECRET not found, using test default");
  }

  // Create a new mongoose instance for testing
  testMongoose = new mongoose.Mongoose();

  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect the test mongoose instance
  await testMongoose.connect(mongoUri, {
    bufferCommands: false,
  });

  console.log("Connected to test database");

  // Define User schema on test mongoose instance
  const userSchema = new testMongoose.Schema(
    {
      username: { type: String, required: true, unique: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      visits: { type: Number, default: 0 },
      visitHistory: [{ date: { type: Date, default: Date.now } }],
      friends: [{ type: testMongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
  );

  userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
  });

  User = testMongoose.model("User", userSchema);

  // Define Weight schema on test mongoose instance
  const weightSchema = new testMongoose.Schema({
    userId: {
      type: testMongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, default: Date.now },
    weightKg: { type: Number },
    targetKg: { type: Number },
  });

  Weight = testMongoose.model("Weight", weightSchema);

  // Create Express app with controllers using my test models
  const testApp = express();
  const testServer = http.createServer(testApp);

  testApp.use(express.json());

  const io = new Server(testServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  testApp.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Define routes inline with test models
  const router = express.Router();

  // Auth middleware
  const protect = (req, res, next) => {
    
    // Get token from headers
    let token = req.headers.authorization;
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    try {
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  };

  // Generate token
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };

  // Register
  router.post("/register", async (req, res) => {
    
    // Extract user details
    const { username, email, password } = req.body;
    
    try {

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = await User.create({ username, email, password });
      
      // Respond with user details and token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Login
  router.post("/login", async (req, res) => {
    
    // Extract credentials
    const { username, password } = req.body;

    // Check if username and password are provided
    try {
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password required" });
      }
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
      
      // Respond with user details and token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get profile
  router.get("/profile", protect, async (req, res) => {
    
    // Fetch user profile
    try {
      const user = await User.findById(req.user).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      
      // Return user profile
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
  });

  // Update profile
  router.put("/profile", protect, async (req, res) => {
    const { username, email } = req.body;
    try {
      
      // Find the user and update
      const user = await User.findById(req.user);
      
      // Check if user exists
      if (!user) return res.status(404).json({ message: "User not found" });
      
      // Check if new username or email is the same
      if (username) user.username = username;
      if (email) user.email = email;

      await user.save();

      // Emit profile update via Socket.io
      req.io.emit("profileUpdated", {
        userId: req.user,
        username: user.username,
        email: user.email,
      });
      // 
      res.json({ message: "Profile updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Increment visits
  router.put("/visits", protect, async (req, res) => {
    
    // Increment visit count and log visit
    try {
      
      // Find user
      const user = await User.findById(req.user);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.visits = (user.visits || 0) + 1;
      user.visitHistory.push({ date: new Date() });
      await user.save();
      
      // Return updated visits
      res.json({
        visits: user.visits,
        visitHistory: user.visitHistory,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get friends list
  router.get("/friends", protect, async (req, res) => {
    
    // Fetch friends list
    try {
      const user = await User.findById(req.user).populate(
        "friends",
        "username email"
      );

      // Check if user exists
      if (!user) return res.status(404).json({ message: "User not found" });
      
      // Return friends
      res.json(user.friends);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Add friend
  router.put("/friends/add", protect, async (req, res) => {
    
    // Add a friend by username
    const { friendName } = req.body;
    
    try {
      
      // Find user and friend
      const user = await User.findById(req.user);
      const friend = await User.findOne({ username: friendName });
      
      // Check if both exist
      if (!user || !friend)
        return res.status(404).json({ message: "User not found" });
      if (user.friends.includes(friend._id)) {
        return res.status(400).json({ message: "Already friends" });
      }

      // Add friend and save
      user.friends.push(friend._id);
      await user.save();

      // Return success message
      res.json({ message: "Friend added" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get friends weights
  router.get("/friends/weights", protect, async (req, res) => {
    
    // Fetch friends' latest weights
    try {
      const user = await User.findById(req.user).populate(
        "friends",
        "username email"
      );

      // Check if user exists
      if (!user) return res.status(404).json({ message: "User not found" });
      const friendsWithWeights = await Promise.all(
        user.friends.map(async (friend) => {
          const latestWeight = await Weight.findOne({
            userId: friend._id,
          }).sort({ date: -1 });
          return {
            username: friend.username,
            email: friend.email,
            currentWeight: latestWeight?.weightKg || null,
            targetWeight: latestWeight?.targetKg || null,
          };
        })
      );

      // Return friends with weights
      res.json(friendsWithWeights);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  testApp.use("/api/users", router);

  app = testApp;
  console.log("Test app created");
}, 40000);

// Cleanup after all tests
afterAll(async () => {
  console.log("Cleaning up...");
  if (testMongoose && testMongoose.connection.readyState !== 0) {
    await testMongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log("Cleanup complete");
}, 10000);

// Cleanup database after each test
afterEach(async () => {
  if (testMongoose && testMongoose.connection.readyState === 1) {
    const collections = testMongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}, 10000);

// Test suites
describe("User Registration and Authentication", () => {
  
  // Test user registration
  test("should register new user successfully", async () => {
    
    // Define new user data
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Make registration request
    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);

    // Log response for debugging
    if (response.status !== 201) {
      console.error("Registration failed:", response.status, response.body);
    }

    // Verify response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "test@example.com");
    expect(response.body).toHaveProperty("token");
  });

  // Test duplicate email rejection
  test("should reject duplicate email", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Register user first time
    await request(app).post("/api/users/register").send(newUser).expect(201);
    const response = await request(app)
      .post("/api/users/register")
      .send(newUser)
      .expect(400);

    // Verify duplicate email rejection
    expect(response.body.message).toBe("User already exists");
  });

  // Test user login
  test("should login with correct credentials", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Register user
    await request(app).post("/api/users/register").send(newUser);

    // Attempt login
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password123" })
      .expect(200);

    // Verify successful login
    expect(response.body).toHaveProperty("token");
    expect(response.body.username).toBe("testuser");
  });

  // Test case insensitive login
  test("should login with case insensitive username", async () => {
    
    // Register user with specific casing
    const newUser = {
      username: "TestUser",
      email: "test@example.com",
      password: "password123",
    };

    // Register user
    await request(app).post("/api/users/register").send(newUser);

    // Attempt login with different casing
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password123" })
      .expect(200);

    // Verify successful login
    expect(response.body).toHaveProperty("token");
  });

  // Test invalid credentials rejection
  test("should reject invalid credentials", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Register user
    await request(app).post("/api/users/register").send(newUser);

    // Attempt login with wrong password
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "wrongpassword" })
      .expect(401);

    // Verify invalid credentials rejection
    expect(response.body.message).toBe("Invalid credentials");
  });

  // Test missing credentials rejection
  test("should reject missing credentials", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser" })
      .expect(400);

    // Verify missing credentials rejection
    expect(response.body.message).toBe("Username and password required");
  });
});

// User profile tests
describe("User Profile Operations", () => {
  let authToken;

  // Register a user before each test
  beforeEach(async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);
    authToken = response.body.token;
  });

  // Test getting user profile
  test("should get user profile with valid token", async () => {
    
    // Make request to get profile
    const response = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    // Verify profile data
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "test@example.com");
    expect(response.body).toHaveProperty("visits");
  });

  // Test unauthorized access rejection
  test("should reject unauthorized access", async () => {
    await request(app).get("/api/users/profile").expect(401);
  });

  // Test updating username and email
  test("should update username and email", async () => {
    const response = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ username: "newusername", email: "newemail@example.com" })
      .expect(200);

    // Verify update success message
    expect(response.body.message).toBe("Profile updated successfully");
  });
});

// Visit tracking tests
describe("Visit Tracking", () => {
  let authToken;

  // Register a user before each test
  beforeEach(async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    // Register user and get auth token
    const response = await request(app)
      .post("/api/users/register")
      .send(newUser);
    authToken = response.body.token;
  });

  // Test incrementing visits
  test("should increment visits", async () => {
    const response = await request(app)
      .put("/api/users/visits")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    // Verify visit increment
    expect(response.body).toHaveProperty("visits", 1);
    expect(response.body).toHaveProperty("visitHistory");
    expect(Array.isArray(response.body.visitHistory)).toBe(true);
  });

  // Test multiple visit increments
  test("should handle multiple visit increments", async () => {
    await request(app)
      .put("/api/users/visits")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    const response = await request(app)
      .put("/api/users/visits")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    // Verify multiple visit increments
    expect(response.body.visits).toBe(2);
    expect(response.body.visitHistory.length).toBe(2);
  });
});

// Friends functionality tests
describe("Friends Functionality", () => {
  let user1Token, user2Token, user2Id;

  // Register two users before each test
  beforeEach(async () => {
    const user1Response = await request(app).post("/api/users/register").send({
      username: "user1",
      email: "user1@example.com",
      password: "password123",
    });

    const user2Response = await request(app).post("/api/users/register").send({
      username: "user2",
      email: "user2@example.com",
      password: "password123",
    });

    user1Token = user1Response.body.token;
    user2Token = user2Response.body.token;
    user2Id = user2Response.body._id;
  });

  // Test adding a friend
  test("should add a friend", async () => {
    const response = await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "user2" })
      .expect(200);

    // Verify friend addition
    expect(response.body.message).toBe("Friend added");
  });

  // Test adding non-existent friend rejection
  test("should reject adding non-existent friend", async () => {
    const response = await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "nonexistent" })
      .expect(404);

    // Verify rejection message
    expect(response.body.message).toBe("User not found");
  });

  // Test duplicate friend rejection
  test("should reject duplicate friend", async () => {
    await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "user2" });

    const response = await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "user2" })
      .expect(400);

    // Verify duplicate friend rejection
    expect(response.body.message).toBe("Already friends");
  });

  // Test getting friends list
  test("should get friends list", async () => {
    await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "user2" });

    const response = await request(app)
      .get("/api/users/friends")
      .set("Authorization", `Bearer ${user1Token}`)
      .expect(200);

    // Verify friends list
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toBe("user2");
  });

  // Test getting friends weights
  test("should get friends weights", async () => {
    await request(app)
      .put("/api/users/friends/add")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({ friendName: "user2" });

    await Weight.create({
      userId: user2Id,
      weightKg: 75,
      targetKg: 70,
      date: new Date(),
    });

    const response = await request(app)
      .get("/api/users/friends/weights")
      .set("Authorization", `Bearer ${user1Token}`)
      .expect(200);

    // Verify friends weights
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toBe("user2");
    expect(response.body[0].currentWeight).toBe(75);
    expect(response.body[0].targetWeight).toBe(70);
  });
});

const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const User = require("../../Backend/models/User");
const bcrypt = require("bcrypt");
const {
  registerUser,
  loginUser,
} = require("../../Backend/controllers/userController");

const suite = require("mocha").suite;
const test = require("mocha").test;

// Mock environment variable
process.env.JWT_SECRET = "testsecret";


suite("User Controller", function () {
  
  // Mocks and stubs
  let req, res, sandbox;

  // Setup and teardown
  beforeEach(function () {
    sandbox = sinon.createSandbox();

    req = { body: {} };

    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  // Test cases
  suite("registerUser", function () {
    
    // Test cases for registerUser function

    // Check if user exists
    test("returns 400 if user already exists", async function () {
      sandbox.stub(User, "findOne").resolves({ email: "test@test.com" });

      // Example request body
      req.body = {
        username: "Josh",
        email: "test@test.com",
        password: "password",
      };

      // Call the registerUser function
      await registerUser(req, res);

      // Response checks
      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWithMatch({ message: "User already exists" })
      ).to.be.true;
    });

    // Returns a token on successful registration
    test("creates a new user and returns a token", async function () {
      sandbox.stub(User, "findOne").resolves(null);

      sandbox.stub(User, "create").resolves({
        _id: "123",
        username: "Josh",
        email: "test@test.com",
      });

      // Example user request body
      req.body = {
        username: "Josh",
        email: "test@test.com",
        password: "password",
      };

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;

      const responseBody = res.json.args[0][0];
      
      // Check if the response body contains the expected properties
      expect(responseBody).to.have.property("token");
      expect(responseBody).to.have.property("username", "Josh");
    });
  });

  // Test cases for loginUser function
  suite("loginUser", function () {
    
    // Test if username or password is missing
    test("returns 400 if username or password missing", async function () {
      req.body = {};

      await loginUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    // Test for valid login
    test("returns token on valid login", async function () {
      const hashedPassword = await bcrypt.hash("password", 10);
      sandbox.stub(User, "findOne").resolves({
        _id: "123",
        username: "Josh",
        email: "test@test.com",
        password: hashedPassword,
      });

      sandbox.stub(bcrypt, "compare").resolves(true);

      req.body = {
        username: "Josh",
        password: "password",
      };

      await loginUser(req, res);

      // Response checks
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.args[0][0]).to.have.property("token");
      expect(res.json.args[0][0]).to.have.property("username", "Josh");
    });

    // Test for incorrect password
    test("returns 401 if password is incorrect", async function () {
      sandbox.stub(User, "findOne").resolves({
        _id: "123",
        username: "Josh",
        password: "$2b$10$fakehash",
      });

      sandbox.stub(bcrypt, "compare").resolves(false);

      req.body = {
        username: "Josh",
        password: "wrongpassword",
      };

      await loginUser(req, res);

      // Response checks
      expect(res.status.calledWith(401)).to.be.true;
      expect(
        res.json.calledWithMatch({ message: "Invalid credentials" })
      ).to.be.true;
    });
  });
});

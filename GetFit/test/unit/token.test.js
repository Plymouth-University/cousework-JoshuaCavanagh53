// test/unit/token.test.js
const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../Backend/controllers/userController"); // adjust path
const suite = require("mocha").suite;
const test = require("mocha").test;

// Set a test secret for JWT
process.env.JWT_SECRET = "testsecret";

// Test suite for token generation
suite("Token Generation", function () {
  
  // Test case for token generation
  test("generateToken returns a string", function () {
    const token = generateToken("12345");
    expect(token).to.be.a("string");
  });

  // Test case for token content
  test("generateToken encodes the correct id", function () {
    // Generate a token with a known id
    const token = generateToken("abc123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the decoded token contains the correct id
    expect(decoded).to.have.property("id", "abc123");
  });
});

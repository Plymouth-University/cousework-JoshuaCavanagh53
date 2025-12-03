// test/unit/token.test.js
const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../Backend/controllers/userController"); // adjust path
const suite = require("mocha").suite;
const test = require("mocha").test;

// Set a test secret for JWT
process.env.JWT_SECRET = "testsecret";


suite("Token Generation", function () {
  test("generateToken returns a string", function () {
    const token = generateToken("12345");
    expect(token).to.be.a("string");
  });

  test("generateToken encodes the correct id", function () {
    const token = generateToken("abc123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).to.have.property("id", "abc123");
  });
});

const chai = require("chai");
const expect = chai.expect;
const suite = require("mocha").suite;
const test = require("mocha").test;

// Extracted helper for testing
function toggleFormMode(currentMode) {
  return currentMode === "login" ? "register" : "login";
}

suite("Form Mode Toggle", function () {
  test("switches from login to register", function () {
    expect(toggleFormMode("login")).to.equal("register");
  });

  test("switches from register to login", function () {
    expect(toggleFormMode("register")).to.equal("login");
  });
});

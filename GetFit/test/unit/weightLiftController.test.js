const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const Weight = require("../../Backend/models/weight");
const Lift = require("../../Backend/models/lift");
const User = require("../../Backend/models/User");

const {
  addWeightEntry,
  addLiftEntry,
} = require("../../Backend/controllers/weightLiftController");

const suite = require("mocha").suite;
const test = require("mocha").test;

// Test suite for weight and lift controller functions
suite("Weight & Lift Controller", function () {
  let req, res;

  beforeEach(function () {
    req = {
      user: "user123",
      body: {},
      io: { emit: sinon.stub() },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  // Test cases for addWeightEntry and addLiftEntry functions
  test("addWeightEntry creates weight and emits socket event", async function () {
    sinon.stub(Weight, "create").resolves({});
    sinon.stub(User, "findById").returns({
      select: sinon.stub().resolves({ username: "Josh" }),
    });

    req.body = { weightKg: 80, targetKg: 75 };

    await addWeightEntry(req, res);

    // Response checks
    expect(Weight.create.calledOnce).to.be.true;
    expect(req.io.emit.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;

    Weight.create.restore();
    User.findById.restore();
  });

  // Test case for addLiftEntry function
  test("addLiftEntry creates a lift entry", async function () {
    sinon.stub(Lift, "create").resolves({});

    req.body = {
      exercise: "Bench Press",
      sets: [{ weightKg: 60, reps: 8 }],
    };

    await addLiftEntry(req, res);

    // Response checks
    expect(Lift.create.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;

    Lift.create.restore();
  });
});

const mongoose = require("mongoose");

const loadSchema = new mongoose.Schema(
  {
    customer: String,
    transitMode: String,
    pickUpLocation: String,
    dropOffLocation: String,
    returnRail: String,
    yarnPull: String,
    loadedRail: String,
    status: String,
    appointmentTime: String,
    reservation: String,
    puName: String
  },
  {
    timestamps: true
  }
);

const Loads = mongoose.model("Loads", loadSchema);

module.exports = Loads;

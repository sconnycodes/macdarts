const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  average: {
    type: Number,
    required: true,
    default: 0,
  },
  firstNineAvg: {
    type: Number,
    required: true,
    default: 0,
  },
  avgDartsPerLeg: {
    type: Number,
    required: true,
    default: 0,
  },
  legsPlayed: {
    type: Number,
    required: true,
    default: 0,
  },
  gamesPlayed: {
    type: Number,
    required: true,
    default: 0,
  },
  dartsAtDouble: {
    type: Number,
    required: true,
    default: 0,
  },
  dartTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  doublePercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  firstNineTotal: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("UserStats", UserStatsSchema);

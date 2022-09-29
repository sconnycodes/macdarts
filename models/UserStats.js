const mongoose = require("mongoose");

const UserStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  average: {
    type: Number,
    required: true,
  },
  firstNineAvg: {
    type: Number,
    required: true,
  },
  avgDartsPerLeg: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserStats", UserStatsSchema);

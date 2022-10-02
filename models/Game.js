const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameID: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  legScores:{
    type: Array,
    required: true,
  },
  dartTotal:{
    type: Number,
    required: true,
  },
  dartsAtDouble:{
    type: Number,
    required: true,
  },
  numberOfLegs:{
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Game", GameSchema);

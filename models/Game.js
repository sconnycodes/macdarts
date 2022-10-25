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
    default: 0,
  },
  dartsAtDouble:{
    type: Number,
    required: true,
    default: 0,
  },
  numberOfLegs:{
    type: Number,
    required: true,
    default: 0,
  },
  firstNineTotal:{
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Game", GameSchema);

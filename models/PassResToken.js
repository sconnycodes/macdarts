const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: Object,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900,// this is the expiry time in seconds
  },
});
module.exports = mongoose.model("Token", tokenSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
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
    expires: 3600,// this is the expiry time in seconds 900 = 15 minutes, 1800 = 30 minutes
  },
});


// Token hash middleware.

TokenSchema.pre("save", function save(next) {
  const newToken = this;
  if (!newToken.isModified("token")) {
    return next();
  }
  bcrypt.hash(newToken.token, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      newToken.token = hash;
      next();
    });
  });
;

// Helper method for validating user's password.

// TokenSchema.methods.compareToken = function compareToken(
//   candidateToken,
//   cb
// ) {
//   bcrypt.compare(candidateToken, this.token, (err, isMatch) => {
//     cb(err, isMatch);
//   });
// };

module.exports = mongoose.model("Token", TokenSchema);
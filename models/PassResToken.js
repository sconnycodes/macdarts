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
    expires: 1800,// this is the expiry time in seconds 900 = 15 minutes
  },
});


// Token hash middleware.

TokenSchema.pre("save", function save(next) {
  const checktoken = this;
  if (!checktoken.isModified("token")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(checktoken.token, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      checktoken.token = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

TokenSchema.methods.compareToken = function compareToken(
  candidateToken,
  cb
) {
  bcrypt.compare(candidateToken, this.token, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("Token", TokenSchema);
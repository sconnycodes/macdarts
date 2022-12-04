const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const UserStats = require("../models/UserStats");
const Token = require("../models/PassResToken");
const { randomBytes } = require("node:crypto");
const bcrypt = require("bcrypt");

const { send } = require("../middleware/emailer")
const crypto = require("crypto")

const ejs = require("ejs")



exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/profile");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  const userStats = new UserStats({
    userName: req.body.userName,

  })
 
  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          userStats.save((err) => {
            if(err){
              return next(err)
            }
          })
          res.redirect("/profile");
        });
      });
    }
  );
};

exports.getPasswordReset = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
  } 
  
  res.render("passwordReset", {
    title: "Password Reset",
  });
  
  
};

exports.postPasswordReset = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
      // send to confirm page
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) { 
        await token.deleteOne()
  };
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 10);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `macdarts.markmac.dev/passwordResetConfirm?token=${resetToken}&id=${user._id}`;
 

  const resetEmail = await ejs.renderFile("./emailTemplates/passwordReset.ejs", { name: user.userName, link: link, })

  
  const mailOptions = {
    from: '"Support @ MacDarts" <usersupport@markmac.dev>',
    to: user.email,
    subject: 'Password Reset',
    html: resetEmail,
  }
  
  await send(mailOptions, (error) => {
        if (error) {
        return console.log(error);
        }
        console.log('Successfully sent');
        
  });
  
  res.redirect("/login")
  

};

exports.resetPassword = async (userId, token, password) => {
  let passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset request");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset request");
  }
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );
  await passwordResetToken.deleteOne();
  return true;
};
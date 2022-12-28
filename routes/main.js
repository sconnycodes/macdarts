const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const gameController = require("../controllers/game")
const { ensureAuth, ensureGuest } = require("../middleware/auth");


//Main Routes
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, homeController.getProfile);
router.get("/profile/settings", ensureAuth, homeController.getSettings);


// Auth Routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/passwordReset", authController.getPasswordReset)
router.post("/passwordReset", authController.postPasswordReset)
router.get("/changePassword", authController.getChangePassword)
router.post("/changePassword", authController.postChangePassword)
// router.post("/passwordResetConfirm", authController.passwordResetConfirm)

//Game Routes
router.get("/game", ensureAuth, gameController.getGame)
router.post("/game", ensureAuth, gameController.completeGame)

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const gameController = require("../controllers/game")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, homeController.getProfile);
router.get("/profile/settings", ensureAuth, homeController.getSettings);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/game", ensureAuth, gameController.getGame)
router.post("/game", ensureAuth, gameController.completeGame)

module.exports = router;

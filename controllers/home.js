const UserStats = require("../models/UserStats")

module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs");
  },
  getProfile: async (req, res) => {
    try {
      let userStats = await UserStats.findOne({userName: req.user.userName})
      res.render("profile.ejs", { user: req.user, userStats });
    } catch (err) {
      console.log(err);
    }
  },
  getSettings: async (req, res) => {
    try {
      
      res.render("settings.ejs", { user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
};

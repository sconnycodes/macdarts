module.exports = {
    getGame: (req, res) => {
      res.render("game.ejs");
    },
    completeGame: (req, res) => {
        console.log(req.body)
      res.redirect("home.js")  
    }
  };
  
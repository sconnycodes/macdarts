module.exports = {
    getGame: (req, res) => {
      res.render("game.ejs");
    },
    completeGame: (req, res) => {
        console.log(req)
      res.redirect("home.js")  
    }
  };
  
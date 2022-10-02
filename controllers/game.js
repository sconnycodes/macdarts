const Game = require("../models/Game")
const UserStats = require("../models/UserStats")

module.exports = {
    getGame: (req, res) => {
      res.render("game.ejs");
    },
    completeGame: async (req, res) => {
      try {
        console.log(req.user.userName)
        
        let gamesPlayed = await UserStats.findOne({userName: req.user.userName})
        let gameIDnum = (gamesPlayed.gamesPlayed + 1)
        
        const result = await Game.create({
          gameID: gameIDnum,
          user: req.user.id,
          legScores: req.body.legScores,
          dartTotal: req.body.dartTotal,
          dartsAtDouble: req.body.dartsAtDouble,
          numberOfLegs: req.body.numberOfLegs,
        });
        console.log(result)
        gamesPlayed.gamesPlayed = gameIDnum; 
        await gamesPlayed.save()
        res.redirect("/profile")
          
        
      } catch (error) {
        res.status(400).json({message: "an error occured", error: error.message})
      }  
      
      
    }
  };
  
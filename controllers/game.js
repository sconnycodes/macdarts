const Game = require("../models/Game")
const UserStats = require("../models/UserStats")

module.exports = {
    getGame: (req, res) => {
      res.render("game.ejs");
    },
    completeGame: async (req, res) => {
      try {
        console.log(req.user.userName)
        
        let userStats = await UserStats.findOne({userName: req.user.userName})

        let gameIDnum = (userStats.gamesPlayed + 1)
        
        const result = await Game.create({
          gameID: gameIDnum,
          user: req.user.id,
          legScores: req.body.legScores,
          dartTotal: req.body.dartTotal,
          dartsAtDouble: req.body.dartsAtDouble,
          numberOfLegs: req.body.numberOfLegs,
          firstNineTotal: req.body.firstNineTotal,
        });
       
        userStats.gamesPlayed = gameIDnum; 
        userStats.legsPlayed += result.numberOfLegs
        userStats.dartsAtDouble += result.dartsAtDouble
        userStats.dartTotal += result.dartTotal
        userStats.firstNineTotal += result.firstNineTotal
        //3 dart avg, consider renaming in model
        userStats.average = ((userStats.legsPlayed * 501) / userStats.dartTotal) * 3;
        userStats.firstNineAvg = (userStats.firstNineTotal / (userStats.legsPlayed * 3)).toFixed(2)
        userStats.avgDartsPerLeg = userStats.dartTotal / userStats.legsPlayed;
        userStats.doublePercentage = (userStats.legsPlayed / userStats.dartsAtDouble) * 100 ;
        await userStats.save()
        res.redirect("/profile")
          
        
      } catch (error) {
        res.status(400).json({message: "an error occured", error: error.message})
      }  
      
      
    }
  };
  
const Game = require("../models/Game")

module.exports = {
    getGame: (req, res) => {
      res.render("game.ejs");
    },
    completeGame: async (req, res) => {
      try {
        console.log(req.body)
        res.status(201).json({message: "Game saved"})
        
      } catch (error) {
        res.status(400).json({message: "an error occured", error: error.message})
      }  
      
      
    }
  };
  
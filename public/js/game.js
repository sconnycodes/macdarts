//grabbing mainScore display and currentTurn display
const mainScoreDisplay = document.querySelector("#playerMainCount")
const currentTurnScoreDisplay = document.querySelector("#currentTurnScore")

const prevTurnScoreDisplay = document.querySelector("#prevTurnScore")
const averageDisplay = document.querySelector("#average")
const first9averageDisplay = document.querySelector("#first9avg")
const legsPlayedDisplay = document.querySelector("#legsPlayed")

const clearButton = document.querySelector("#clearButton")

// Setting up event listeners on buttons.
const buttons = document.querySelectorAll(".gameEntryButton");
buttons.forEach(item => {
    item.addEventListener("click", event => {
    const {target} = event;
    const {value} = target;
    //check which button is pressed to trigger relevant function    
    if (value == "back"){
    //     return to previous playerScore
        testGame.back()
    } else if (value == "next") {
    //      deduct current turn score from playerScore
        testGame.next()
    } else {
        // add value of button to currentScore
        currentTurnScoreDisplay.innerText += value
    }
    })
});

//clear button to delete whatever is in current turn score display
clearButton.addEventListener("click", () => {
    currentTurnScoreDisplay.innerText = ""
});

// game setup as object
class Game {
    constructor(gameID) {
        this.gameID = gameID,
        this.mainScore = 501,
        this.currentTurn = 0,
        mainScoreDisplay.innerText = this.mainScore,
        // keep track of scores in leg & number of darts taken
        this.legScores = [],
        
        this.average = 0,
        this.legDartTotal = 0,
        this.scoredSoFar = 0,
        // tracking total darts used at double, this can be used to track double %
        this.dartsAtDouble = 0,
        //total of first 9 darts / 3
        this.firstNineDarts = 0,
        // once currentgame is completed (mainscore 0) then add legscores & dartTotal to game data eg. 
        // [ {legsScores, legdartTotal} ] and reset ready for next game.
        this.gameData = {
            legScores: [],
            dartTotal: 0,
            dartsAtDouble: 0,
            numberOfLegs: 0,
            //total Score in first 9
            firstNineTotal: 0,
            
            
        }
        // when all games are completed a submit button will then send this gameData to the database to be used for stat tracking
        
    }

    //function to run when next is clicked
    next(){
        //sub currentTurn score from mainScore and update display
        this.currentTurn = parseInt(currentTurnScoreDisplay.innerText)
        // check number is valid (180 & below but without being more than total remaining or leaving a mainscore of 1)
        if (this.currentTurn === 0) {
            this.nextUpdate()
        
        } else if (this.currentTurn > 180 || this.currentTurn > this.mainScore || (this.mainScore - this.currentTurn == 1) || !this.currentTurn) {
            this.updateMainScore()
            alert("Invalid score") 
        } else {
            this.nextUpdate()
        }
        
    }

    //update game data on "next" click
    nextUpdate(){
    // add currentTurn score to array of scores
        this.legScores.push(this.currentTurn)
            //calc mainscore
        this.mainScore -= this.currentTurn
        this.scoredSoFar += this.currentTurn
        // update prev turn score
        prevTurnScoreDisplay.innerText = this.currentTurn
        
        
        
        //check if main is 0 and end gamethis.legDartTotal -= 3
        this.gameEndCheck()
    }
    //function to run when back is clicked
    back(){
        //add prev turn score back to main and update display
        if (this.mainScore < 501){
            let prevTurnScore = this.legScores.pop()
            this.mainScore += prevTurnScore
            this.scoredSoFar -= prevTurnScore
            if(this.legDartTotal <= 9){
                this.gameData.firstNineTotal -= prevTurnScore
                this.firstNineDarts -= 1
            }
            prevTurnScoreDisplay.innerText = this.legScores[this.legScores.length - 1]
        }
        if (this.legDartTotal > 2){
            this.legDartTotal -= 3
            this.gameData.dartTotal -= 3
        }
        
        this.updateMainScore()
    }

    //update score displays during turns
    updateMainScore(){
        currentTurnScoreDisplay.innerText = ""
        mainScoreDisplay.innerText = this.mainScore
        averageDisplay.innerText = (this.scoredSoFar / (this.gameData.dartTotal / 3)).toFixed(2) 
        first9averageDisplay.innerText = (this.gameData.firstNineTotal / this.firstNineDarts).toFixed(2)
    }

    // check if score is 0 and push current game to gameData if so.
    gameEndCheck(){
        if (this.legDartTotal < 9){
            this.gameData.firstNineTotal += this.currentTurn
            this.firstNineDarts += 1
        }
        if (this.mainScore == 0){
            // last turn may take fewer than 3 darts so prompt for this & number of darts attempted on double
            
            let turnDarts = +prompt("How many darts used for checkout?")
            this.dartsAtDouble += +prompt("How many darts used on double?")
            this.legDartTotal += turnDarts
            this.gameData.dartTotal += turnDarts
            this.gameData.legScores.push([this.legScores.map(x => x), this.legDartTotal])
            this.gameData.dartsAtDouble += this.dartsAtDouble
            this.gameData.numberOfLegs += 1
            this.updateMainScore()
            // this.restartGame()
            this.restartGame()
    


        } else if (this.mainScore <= 50) {
            this.legDartTotal += 3
            this.gameData.dartTotal += 3
            this.currentTurn = 0
            this.dartsAtDouble += +prompt("How many darts used on double?")
            this.updateMainScore()
        } else {
            //each score that doesn't result in mainscore 0 will add 3 darts to total
            this.legDartTotal += 3
            this.gameData.dartTotal += 3
            this.currentTurn = 0
            this.updateMainScore()
        }
    }

    // restart game function resets scores and clear legscores and leg dart totals
    restartGame(){
        let restart = confirm("Start new game?")
        if (restart){
        this.mainScore = 501
        this.currentTurn = 0
        this.legDartTotal = 0
        this.dartsAtDouble = 0
        this.legScores.splice(0, this.legScores.length)
        this.updateMainScore()
        }
        if(!restart){
            let submitScore = confirm("Submit data?")
            if(submitScore){
                this.sendData()
            } else {
                window.location("/profile")
            }
        }
        
    }

    // Send game data to server for storage
    async sendData(){
        try{
            console.log(this.gameData)
            const response = await fetch("/game", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            
            },
            // Need to stringify in order to send data over http(?my understanding anyway)
            body: JSON.stringify(this.gameData) 
            });
            
            const {url, redirected} = response
            if(redirected){
                window.location.href = url
            }

        } catch (err) {
            console.log(err)
        }
        
    
  
    }
};

let testGame = new Game()
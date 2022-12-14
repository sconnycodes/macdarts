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

// Modals initialise
    // Methods for Modals for double & checkout number of darts
async function doubleDartsModalShow(){
    // Modal for game end (checking number of darts at double and darts for checkout)
    const doublesModal = new bootstrap.Modal(document.getElementById('doublesModal'))
    doublesModal.show()
    let answer = await new Promise((resolve) => {
        try {
            document.getElementById("doubleConfirm").addEventListener("click", e => {
                let value = +e.target.dataset.doubleDartsNum
                doublesModal.hide()
                resolve(value)
            })
            document.getElementById("doubleClose").addEventListener("click", e => {
                let value = 0
                resolve(value)
            })
        } catch (error) {
            console.error(error)
            resolve(0)
        }
    })
    return answer
}

    //checkout modal
async function checkoutModalShow(){
    // Modal for game end (checking number of darts at double and darts for checkout)
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'))
    checkoutModal.show()  
    let answer = await new Promise((resolve) => {
        try {
            document.getElementById("checkoutConfirm").addEventListener("click", e => {
                let value = +e.target.dataset.checkoutDartsNum
                checkoutModal.hide()
                resolve(value)
            })
            document.getElementById("checkoutClose").addEventListener("click", e => {
                let value = 0
                resolve(value)
            })
        } catch (error) {
            console.error(error)
            resolve(0)
        }
    })
    return answer
}

// restart modal
async function restartModalShow(){
    // Modal for game end (checking number of darts at double and darts for checkout)
    const restartModal = new bootstrap.Modal(document.getElementById('restartModal'))
    restartModal.show()   
    let answer = await new Promise((resolve) => {
        try {
            document.getElementById("restartYes").addEventListener("click", e => {    
                restartModal.hide()
                resolve(true)
            })
            document.getElementById("restartNo").addEventListener("click", e => {  
                restartModal.hide()
                resolve(false)
            })
        } catch (error) {
            console.error(error)
            resolve(0)
        }
    })
    return answer
}

// submit Data modal
async function submitDataModalShow(){
    // Modal for game end (checking number of darts at double and darts for checkout)
    const submitDataModal = new bootstrap.Modal(document.getElementById('submitDataModal'))
    submitDataModal.show()
    
    let answer = await new Promise((resolve) => {
        try {
            document.getElementById("submitDataYes").addEventListener("click", e => { 
                submitDataModal.hide()
                resolve(true)
            })
            document.getElementById("submitDataNo").addEventListener("click", e => {     
                submitDataModal.hide()
                resolve(false)
            })
        } catch (error) {
            console.error(error)
            resolve(0)
        }
    })
    return answer
}

// dartsAtDoubleModalButtons
const dartsAtDoubleModalButtons = document.querySelectorAll(".dartsAtDoubleModalButtons")
dartsAtDoubleModalButtons.forEach(button => {
    button.addEventListener("click", e => {
        dartsAtDoubleModalButtons.forEach(button => {
            button.classList.remove("active")
        })
        e.target.classList.add("active")
        document.getElementById("doubleConfirm").dataset.doubleDartsNum = e.target.value
    })
})

// checkoutModalButtons
const checkoutModalButtons = document.querySelectorAll(".checkoutModalButtons")
checkoutModalButtons.forEach(button => {
    button.addEventListener("click", e => {
        checkoutModalButtons.forEach(button => {
            button.classList.remove("active")
        })
        e.target.classList.add("active")
        document.getElementById("checkoutConfirm").dataset.checkoutDartsNum = e.target.value
    })
})

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
    async gameEndCheck(){
        if (this.legDartTotal < 9){
            this.gameData.firstNineTotal += this.currentTurn
            this.firstNineDarts += 1
        }
        if (this.mainScore == 0){
            // last turn may take fewer than 3 darts so prompt for this & number of darts attempted on double
            try {
                let turnDarts = await checkoutModalShow()
                this.legDartTotal += turnDarts
                let doubleDartsNum = await doubleDartsModalShow()
                this.dartsAtDouble += doubleDartsNum
                this.gameData.dartTotal += turnDarts
                this.gameData.legScores.push([this.legScores.map(x => x), this.legDartTotal])
                this.gameData.dartsAtDouble += this.dartsAtDouble
                this.gameData.numberOfLegs += 1
                this.updateMainScore()
                // this.restartGame()
                this.restartGame()
            } catch (error) {
                this.updateMainScore()
            }            
            // Replaced below prompts with Modals above
            // let turnDarts = +prompt("How many darts used for checkout?")
            // this.dartsAtDouble += +prompt("How many darts used on double?")
            
        } else if (this.mainScore <= 50) {
            this.legDartTotal += 3
            this.gameData.dartTotal += 3
            this.currentTurn = 0
            // Below prompt replaced with Modals
            // this.dartsAtDouble += +prompt("How many darts used on double?")
            try {
                let doubleDartsNum = await doubleDartsModalShow()
                this.dartsAtDouble += doubleDartsNum
                this.updateMainScore()
            } catch (error) {
                this.updateMainScore()
            }
        } else {
            //each score that doesn't result in mainscore 0 will add 3 darts to total
            this.legDartTotal += 3
            this.gameData.dartTotal += 3
            this.currentTurn = 0
            this.updateMainScore()
        }
    }

    // restart game function resets scores and clear legscores and leg dart totals
    async restartGame(){
        //replace prompt with modal
        // let restart = confirm("Start new game?")
        let restart = await restartModalShow()
        if (restart){
        this.mainScore = 501
        this.currentTurn = 0
        this.legDartTotal = 0
        this.dartsAtDouble = 0
        this.legScores.splice(0, this.legScores.length)
        this.updateMainScore()
        }
        if(!restart){
            // replace confirm with modal
            // let submitScore = confirm("Submit data?")
            let submitScore = await submitDataModalShow()
            if(submitScore){
                this.sendData()
            } else {
                window.location.replace("/profile")
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
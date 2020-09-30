let blocks = document.querySelectorAll(".block")
let currentMove = "player1"
let compTurnBtn = document.querySelector("#comp-turn")
let compHardTurnBtn = document.querySelector("#hard-comp")
let winnerBanner = document.querySelector("h1")

for (let i = 0; i < blocks.length; i++) {
    blocks[i].addEventListener("click", playerMove)
}
compTurnBtn.addEventListener("click", computerEasyMove)
compHardTurnBtn.addEventListener("click", computerHardMove)

function playerMove(e) {
    //click handler applied to each block. When its clicked it updates the status of the game and visual look
    e.target.textContent = "X";
    e.target.dataset.value = "x";
    checkWinner()
}

function computerEasyMove(e) {
    //Get current game status with avilable moves
    let gameStatusArr = []
    for (let i = 0; i < blocks.length; i++) {
        gameStatusArr.push(blocks[i].dataset.value)
    }
    //get number of avilable moves
    let numeAvilableMoves = 0;
    gameStatusArr.forEach(block => {
        if (block === "") {
            numeAvilableMoves += 1;
        };
    })

    //generate random number for avilable move
    let randomMoveIndex = Math.floor(Math.random() * numeAvilableMoves)
        // console.log("Randomg number Index " + randomMoveIndex)

    //Place 0 in first avilable index
    let emptyBlockIndex = -1;
    for (let i = 0; i < gameStatusArr.length; i++) {
        //when at correct index of empty blocks
        if (gameStatusArr[i] === "") {
            emptyBlockIndex += 1
        }
        if (emptyBlockIndex === randomMoveIndex) {
            blocks[i].textContent = "O";
            blocks[i].dataset.value = "o";
            break
        }
    }
    checkWinner()
}

//function to check if someone has won thats called everytime
function checkWinner() {
    //Get current game status with avilable moves
    let gameArr = []
    for (let i = 0; i < blocks.length; i++) {
        gameArr.push(blocks[i].dataset.value)
    }
    //Check for winning combos
    if (gameArr[0] == gameArr[1] && gameArr[0] === gameArr[2] && gameArr[0] !== "") {
        displayWinner(gameArr[0])
    }
    if (gameArr[3] == gameArr[4] && gameArr[3] === gameArr[5] && gameArr[3] !== "") {
        displayWinner(gameArr[3])
    }
    if (gameArr[6] == gameArr[7] && gameArr[6] === gameArr[8] && gameArr[6] !== "") {
        displayWinner(gameArr[6])
    }
    if (gameArr[0] == gameArr[3] && gameArr[0] === gameArr[6] && gameArr[0] !== "") {
        displayWinner(gameArr[0])
    }
    if (gameArr[1] == gameArr[4] && gameArr[1] === gameArr[7] && gameArr[1] !== "") {
        displayWinner(gameArr[1])
    }
    if (gameArr[2] == gameArr[5] && gameArr[2] === gameArr[8] && gameArr[2] !== "") {
        displayWinner(gameArr[2])
    }
    if (gameArr[0] == gameArr[4] && gameArr[0] === gameArr[8] && gameArr[0] !== "") {
        displayWinner(gameArr[0])
    }
    if (gameArr[2] == gameArr[4] && gameArr[2] === gameArr[6] && gameArr[2] !== "") {
        displayWinner(gameArr[2])
    }
    //check for a draw
    if (!gameArr.includes("") && winnerBanner.textContent === "") {
        displayWinner("draw")
    }
}

function displayWinner(winningValue) {
    if (winningValue == "draw") {
        winnerBanner.textContent = "Blah - its a draw"
    } else if (winningValue === "o") {
        winnerBanner.textContent = "Noughts won - pesky computer!"
    } else {
        winnerBanner.textContent = "Crosses won - you beat the computer!"
    }
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].removeEventListener("click", playerMove)
    }
}

function computerHardMove(e) {
    console.log("start of computer move")
    let gameStatusArr = getCurrentGameStatus();
    let move = compTurn(gameStatusArr)
    console.log('Your move is')
    console.log(move)
    blocks[move.move].textContent = "O";
    blocks[move.move].dataset.value = "o";
    checkWinner()

}

function compTurn(gameStatusArr) {
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    console.log("Available moves")
    console.log(availableMoves)
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        tempGame[availableMoves[i]] = "o"
        console.log(`Temp game for compTurn loop ${i}`)
        console.log(tempGame)
        let result = checkWinnerReturn(tempGame);
        let thisMove = {
            move: availableMoves[i]
        }
        if (!result) {
            let nextLevelResult = playerTurn(tempGame)
            console.log("next level result")
            console.log(nextLevelResult)
            thisMove.result = nextLevelResult.result
        } else if (result === "x") {
            thisMove.result = -1
        } else if (result === "o") {
            thisMove.result = 1
        } else if (result === "draw") {
            thisMove.result = 0
        }
        moveResultMatrix.push(thisMove)
    }
    console.log("The move matrix is ")
    console.log(moveResultMatrix)

    //Return the winning move
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === 1) {
            return moveResultMatrix[i]
        }
    }
    //If no winning move return draw move
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === 0) {
            return moveResultMatrix[i]
        }
    }
    // return losing move as a last resort
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === -1) {
            return moveResultMatrix[i]
        }
    }
}

function playerTurn(gameStatusArr) {
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    console.log("Player turn avalable moves")
    console.log(availableMoves)
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        tempGame[availableMoves[i]] = "x" //NB other player value
        console.log(`Player turn temp game loop ${i}`)
        console.log(tempGame)
        let result = checkWinnerReturn(tempGame);
        let thisMove = {
            move: availableMoves[i]
        }
        if (!result) {
            // debugger
            let nextLevelResult = compTurn(tempGame)
            console.log("next level result")
            console.log(nextLevelResult)
            thisMove.result = nextLevelResult.result

            // thisMove.result = "inception"
            // thisMove.result = "incpet"

            console.log("Inception!")
        } else if (result === "x") {
            thisMove.result = -1
        } else if (result === "o") {
            thisMove.result = 1
        } else if (result === "draw") {
            thisMove.result = 0
        }
        moveResultMatrix.push(thisMove)
    }
    console.log("Player turn moveResultMatrix")
    console.log(moveResultMatrix)

    //Return the winning move
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === -1) {
            return moveResultMatrix[i]
        }
    }
    //If no winning move return draw move
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === 0) {
            return moveResultMatrix[i]
        }
    }
    // return losing move as a last resort
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === 1) {
            return moveResultMatrix[i]
        }
    }
}





function getCurrentGameStatus() {
    //Get current game status based on the screen
    let gameStatusArr = []
    for (let i = 0; i < blocks.length; i++) {
        gameStatusArr.push(blocks[i].dataset.value)
    }
    return gameStatusArr;
}

//Returns an array of the index of each available move. So the length will be how may moves are avilable to go
function getAvailableMovesArray(gameStatusArr) {
    let availableMoves = [];
    for (let i = 0; i < gameStatusArr.length; i++) {
        if (gameStatusArr[i] === "") {
            availableMoves.push(i)
        };
    }
    return availableMoves
}

function checkWinnerReturn(gameArr) {
    if (gameArr[0] == gameArr[1] && gameArr[0] === gameArr[2] && gameArr[0] !== "") {
        return gameArr[0];
    } else if (gameArr[3] == gameArr[4] && gameArr[3] === gameArr[5] && gameArr[3] !== "") {
        return gameArr[3];
    } else if (gameArr[6] == gameArr[7] && gameArr[6] === gameArr[8] && gameArr[6] !== "") {
        return gameArr[6];
    } else if (gameArr[0] == gameArr[3] && gameArr[0] === gameArr[6] && gameArr[0] !== "") {
        return gameArr[0];
    } else if (gameArr[1] == gameArr[4] && gameArr[1] === gameArr[7] && gameArr[1] !== "") {
        return gameArr[1];
    } else if (gameArr[2] == gameArr[5] && gameArr[2] === gameArr[8] && gameArr[2] !== "") {
        return gameArr[2];
    } else if (gameArr[0] == gameArr[4] && gameArr[0] === gameArr[8] && gameArr[0] !== "") {
        return gameArr[0];
    } else if (gameArr[2] == gameArr[4] && gameArr[2] === gameArr[6] && gameArr[2] !== "") {
        return gameArr[2];
    } else if (!gameArr.includes("")) {
        return "draw";
    }
    return false // Returns false if there is no winner yet
}
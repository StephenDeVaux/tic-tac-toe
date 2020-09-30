let blocks = document.querySelectorAll(".block")
let compEasyTurnBtn = document.querySelector("#easy-comp-btn")
let compHardTurnBtn = document.querySelector("#hard-comp-btn")
let winnerBanner = document.querySelector("h1")

for (let i = 0; i < blocks.length; i++) {
    blocks[i].addEventListener("click", playerMove)
}
compEasyTurnBtn.addEventListener("click", computerEasyMove)
compHardTurnBtn.addEventListener("click", computerHardMove)

function playerMove(e) {
    e.target.textContent = "X";
    e.target.dataset.value = "x";
    let isWinner = checkWinner(getCurrentGameStatus())
    if (isWinner) {
        console.log("truthey?")
        displayWinner(isWinner)
    }
}

function computerEasyMove(e) {
    let gameStatusArr = getCurrentGameStatus();
    let availableMovesArray = getAvailableMovesArray(gameStatusArr);
    let randomMoveIndex = Math.floor(Math.random() * availableMovesArray.length)
    let moveBlock = availableMovesArray[randomMoveIndex]
    blocks[moveBlock].textContent = "O";
    blocks[moveBlock].dataset.value = "o";
    let isWinner = checkWinner(getCurrentGameStatus())
    if (isWinner) {
        console.log("truthey?")
        displayWinner(isWinner)
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
    let isWinner = checkWinner(getCurrentGameStatus())
    if (isWinner) {
        console.log("truthey?")
        displayWinner(isWinner)
    }
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
        let result = checkWinner(tempGame);
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
        let result = checkWinner(tempGame);
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
    let gameStatusArr = []
    for (let i = 0; i < blocks.length; i++) {
        gameStatusArr.push(blocks[i].dataset.value)
    }
    return gameStatusArr;
}

function getAvailableMovesArray(gameStatusArr) {
    let availableMoves = [];
    for (let i = 0; i < gameStatusArr.length; i++) {
        if (gameStatusArr[i] === "") {
            availableMoves.push(i)
        };
    }
    return availableMoves
}

function checkWinner(gameArr) {
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

function displayWinner(winningValue) {
    if (winningValue == "draw") {
        winnerBanner.textContent = "Blah - its a draw"
    } else if (winningValue === "o") {
        winnerBanner.textContent = "Noughts won - pesky computer!"
    } else if (winningValue === "x") {
        winnerBanner.textContent = "Crosses won - you beat the computer!"
    } else {
        console.log("Oops thats an error")
    }
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].removeEventListener("click", playerMove)
    }
}
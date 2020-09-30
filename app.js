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
        displayWinner(isWinner)
    }
}

function computerHardMove(e) {
    let gameStatusArr = getCurrentGameStatus();
    let move = recursiveComputerTurn(gameStatusArr)
    blocks[move.move].textContent = "O";
    blocks[move.move].dataset.value = "o";
    let isWinner = checkWinner(getCurrentGameStatus())
    if (isWinner) {
        displayWinner(isWinner)
    }
}

function recursiveComputerTurn(gameStatusArr) {
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        let thisMove = {
            move: availableMoves[i]
        }
        tempGame[availableMoves[i]] = "o"
        let isWinner = checkWinner(tempGame);
        if (!isWinner) {
            let nextRecursionResult = recursiveOpponentTurn(tempGame)
            thisMove.result = nextRecursionResult.result
        } else if (isWinner === "x") {
            thisMove.result = -1
        } else if (isWinner === "o") {
            thisMove.result = 1
        } else if (isWinner === "draw") {
            thisMove.result = 0
        }
        moveResultMatrix.push(thisMove)
    }

    let winningMove = getMoveFromResultMatrix(moveResultMatrix, 1)
    let drawMove = getMoveFromResultMatrix(moveResultMatrix, 0)
    let loseMove = getMoveFromResultMatrix(moveResultMatrix, -1)
    if (winningMove) {
        return winningMove
    } else if (drawMove) {
        return drawMove
    } else {
        return loseMove
    }
}

function recursiveOpponentTurn(gameStatusArr) {
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        let thisMove = {
            move: availableMoves[i]
        }
        tempGame[availableMoves[i]] = "x" //NB other player value
        let isWinner = checkWinner(tempGame);
        if (!isWinner) {
            let nextRecursionResult = recursiveComputerTurn(tempGame)
            thisMove.result = nextRecursionResult.result
        } else if (isWinner === "x") {
            thisMove.result = -1
        } else if (isWinner === "o") {
            thisMove.result = 1
        } else if (isWinner === "draw") {
            thisMove.result = 0
        }
        moveResultMatrix.push(thisMove)
    }

    let winningMove = getMoveFromResultMatrix(moveResultMatrix, -1)
    let drawMove = getMoveFromResultMatrix(moveResultMatrix, 0)
    let loseMove = getMoveFromResultMatrix(moveResultMatrix, 1)
    if (winningMove) {
        return winningMove
    } else if (drawMove) {
        return drawMove
    } else {
        return loseMove
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

function getMoveFromResultMatrix(moveResultMatrix, resultValue) {
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === resultValue) {
            return moveResultMatrix[i]
        }
    }
    return false
}
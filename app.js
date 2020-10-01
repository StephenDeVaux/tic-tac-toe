let blocks = document.querySelectorAll(".block")
let winnerBanner = document.querySelector("h2")
let resetBtn = document.querySelector("#reset-btn")
let crossStartBtn = document.querySelector('#cross-start-btn')
let playerXSelectBtns = document.querySelectorAll('.playerX-select-btns')
let playerOSelectBtns = document.querySelectorAll('.playerO-select-btns')
let winCounterXSpan = document.querySelector('#x-wins')
let winCounterOSpan = document.querySelector('#o-wins')
let drawCounterSpan = document.querySelector('#draws')
let playerBgrndX = document.querySelector("#player-bkgrnd-x")
let playerBgrndO = document.querySelector("#player-bkgrnd-o")
let recursionIterations = 0;
let winCounterX = 0;
let winCounterO = 0;
let drawCounter = 0;
let game = {
    crossesPlayer: "player", //player easyComp hardComp -> are the options
    noughtsPlayer: "player",
    currentPlayer: "x",
    playerSymbol: "X",
    oppositionPlayer: "o"
}

function nextTurn() {
    if (game.currentPlayer === "x") {
        game.currentPlayer = "o";
        game.playerSymbol = "O";
        game.oppositionPlayer = "x";
        playerBgrndX.classList.remove("next-turn-highlight")
        playerBgrndO.classList.add("next-turn-highlight")

        if (game.noughtsPlayer === "easyComp") {
            disableAllBlockBtns()
            computerEasyMove()
        } else if (game.noughtsPlayer === "hardComp") {
            disableAllBlockBtns()
            computerHardMove()
        } else {
            enableBlockButtons()
        }
    } else {
        game.currentPlayer = "x"
        game.playerSymbol = "X"
        game.oppositionPlayer = "o"
        playerBgrndX.classList.add("next-turn-highlight")
        playerBgrndO.classList.remove("next-turn-highlight")

        if (game.crossesPlayer === "easyComp") {
            disableAllBlockBtns()
            computerEasyMove()
        } else if (game.crossesPlayer === "hardComp") {
            disableAllBlockBtns()
            computerHardMove()
        } else {
            enableBlockButtons()
        }
    }
}

function playerMove(e) {
    e.target.textContent = game.playerSymbol;
    e.target.dataset.value = game.currentPlayer;
    e.target.classList.add("flip-in-hor-bottom")
    let isWinner = checkWinner(getCurrentGameStatus())
    if (isWinner) {
        displayWinner(isWinner)
    } else {
        nextTurn()
    }
}

function computerEasyMove() {
    setTimeout(function() {
            let gameStatusArr = getCurrentGameStatus();
            let availableMovesArray = getAvailableMovesArray(gameStatusArr);
            let randomMove = Math.floor(Math.random() * availableMovesArray.length)
            let moveBlockIndex = availableMovesArray[randomMove]
            blocks[moveBlockIndex].textContent = game.playerSymbol;
            blocks[moveBlockIndex].dataset.value = game.currentPlayer;
            blocks[moveBlockIndex].classList.add("flip-in-hor-bottom")
            let isWinner = checkWinner(getCurrentGameStatus())
            if (isWinner) {
                displayWinner(isWinner)
            } else {
                nextTurn()
            }
        },
        500
    )
}

function computerHardMove(e) {
    setTimeout(function() {
            recursionIterations = 0
            let gameStatusArr = getCurrentGameStatus();
            let moveObject = recursiveComputerTurn(gameStatusArr)
            blocks[moveObject.move].textContent = game.playerSymbol;
            blocks[moveObject.move].dataset.value = game.currentPlayer;
            blocks[moveObject.move].classList.add("flip-in-hor-bottom")
            console.log(`Number of solutions calculated - ${recursionIterations}`)
            let isWinner = checkWinner(getCurrentGameStatus())
            if (isWinner) {
                displayWinner(isWinner)
            } else {
                nextTurn()
            }
        },
        500)
}

function recursiveComputerTurn(gameStatusArr) {
    recursionIterations++
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        let thisMove = {
            move: availableMoves[i]
        }
        tempGame[availableMoves[i]] = game.currentPlayer;
        let isWinner = checkWinner(tempGame);
        if (!isWinner) {
            let nextRecursionResult = recursiveOpponentTurn(tempGame)
            thisMove.result = nextRecursionResult.result
        } else if (isWinner === game.oppositionPlayer) {
            thisMove.result = -1
        } else if (isWinner === game.currentPlayer) {
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
    recursionIterations++
    let availableMoves = getAvailableMovesArray(gameStatusArr)
    let moveResultMatrix = [];
    for (let i = 0; i < availableMoves.length; i++) {
        let tempGame = [...gameStatusArr]
        let thisMove = {
            move: availableMoves[i]
        }
        tempGame[availableMoves[i]] = game.oppositionPlayer //NB other player value 
        let isWinner = checkWinner(tempGame);
        if (!isWinner) {
            let nextRecursionResult = recursiveComputerTurn(tempGame)
            thisMove.result = nextRecursionResult.result
        } else if (isWinner === game.oppositionPlayer) {
            thisMove.result = -1
        } else if (isWinner === game.currentPlayer) {
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
    setTimeout(function() {
            if (winningValue == "draw") {
                drawCounter++;
                drawCounterSpan.textContent = drawCounter;
                winnerBanner.textContent = "Its a draw!!"
            } else if (winningValue === "o") {
                winCounterO++
                winCounterOSpan.textContent = winCounterO
                winnerBanner.textContent = "Noughts won!!"
            } else if (winningValue === "x") {
                winCounterX++
                winCounterXSpan.textContent = winCounterX
                winnerBanner.textContent = "Crosses won!!"
            } else {
                console.log("Oops thats an error")
            }
            disableAllBlockBtns()
            let winningBlocks = getWinnerArray(getCurrentGameStatus())
            if (winningBlocks) {
                blocks[winningBlocks[0]].classList.add("highlight-win")
                blocks[winningBlocks[1]].classList.add("highlight-win")
                blocks[winningBlocks[2]].classList.add("highlight-win")
            }
        },
        700)
}

function getMoveFromResultMatrix(moveResultMatrix, resultValue) {
    for (let i = 0; i < moveResultMatrix.length; i++) {
        if (moveResultMatrix[i].result === resultValue) {
            return moveResultMatrix[i]
        }
    }
    return false
}

function resetGame() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].textContent = "";
        blocks[i].dataset.value = "";
    }
    winnerBanner.textContent = ""
    game.currentPlayer = "x";
    game.playerSymbol = "X";
    gameoppositionPlayer = "o";
    playerBgrndX.classList.add("next-turn-highlight")
    playerBgrndO.classList.remove("next-turn-highlight")

    for (let i = 0; i < blocks.length; i++) {
        blocks[i].classList.remove("highlight-win")
    }
    if (game.crossesPlayer === "easyComp" || game.crossesPlayer === "hardComp") {
        crossStartBtn.style.visibility = "visible";
        disableAllBlockBtns()
    } else {
        crossStartBtn.style.visibility = "hidden";
        enableBlockButtons()
    }
}

function getWinnerArray(gameArr) {
    if (gameArr[0] == gameArr[1] && gameArr[0] === gameArr[2] && gameArr[0] !== "") {
        return [0, 1, 2];
    } else if (gameArr[3] == gameArr[4] && gameArr[3] === gameArr[5] && gameArr[3] !== "") {
        return [3, 4, 5];
    } else if (gameArr[6] == gameArr[7] && gameArr[6] === gameArr[8] && gameArr[6] !== "") {
        return [6, 7, 8];
    } else if (gameArr[0] == gameArr[3] && gameArr[0] === gameArr[6] && gameArr[0] !== "") {
        return [0, 3, 6];
    } else if (gameArr[1] == gameArr[4] && gameArr[1] === gameArr[7] && gameArr[1] !== "") {
        return [1, 4, 7];
    } else if (gameArr[2] == gameArr[5] && gameArr[2] === gameArr[8] && gameArr[2] !== "") {
        return [2, 5, 8];
    } else if (gameArr[0] == gameArr[4] && gameArr[0] === gameArr[8] && gameArr[0] !== "") {
        return [0, 4, 8];
    } else if (gameArr[2] == gameArr[4] && gameArr[2] === gameArr[6] && gameArr[2] !== "") {
        return [2, 4, 6];
    } else if (!gameArr.includes("")) {
        return false;
    }
    return false // Returns false if there is no winner yet
}

function disableAllBlockBtns() {
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].removeEventListener("click", playerMove)
    }
}

function enableBlockButtons() {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].dataset.value === "") {
            blocks[i].addEventListener("click", playerMove)
        }
    }
}

function crossesComputerStart() {
    if (!getCurrentGameStatus().includes("x") && !getCurrentGameStatus().includes("o")) {
        if (game.crossesPlayer === "easyComp" && game.currentPlayer === "x") {
            computerEasyMove()
        } else if (game.crossesPlayer === "hardComp" && game.currentPlayer === "x") {
            computerHardMove()
        }
    }
    crossStartBtn.style.visibility = "hidden";
}


//Setup listeners
enableBlockButtons()
resetBtn.addEventListener("click", resetGame)
crossStartBtn.addEventListener("click", crossesComputerStart)

for (let i = 0; i < playerXSelectBtns.length; i++) {
    playerXSelectBtns[i].addEventListener('click', function(event) {
        game[event.target.dataset.player] = event.target.dataset.value;
        playerXSelectBtns[0].classList.remove("btn-highlight")
        playerXSelectBtns[1].classList.remove("btn-highlight")
        playerXSelectBtns[2].classList.remove("btn-highlight")
        event.target.classList.add("btn-highlight")
        resetGame()
    })
}

for (let i = 0; i < playerOSelectBtns.length; i++) {
    playerOSelectBtns[i].addEventListener('click', function(event) {
        game[event.target.dataset.player] = event.target.dataset.value;
        playerOSelectBtns[0].classList.remove("btn-highlight")
        playerOSelectBtns[1].classList.remove("btn-highlight")
        playerOSelectBtns[2].classList.remove("btn-highlight")
        event.target.classList.add("btn-highlight")
        resetGame()
    })
}
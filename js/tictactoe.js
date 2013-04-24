window.onload = function() {
    buildBoard();
}


// Create a new div for each square on the tic-tac-toe board.
// Squares are numbered: 0-1-2
//                       3-4-5
//                       6-7-8
function buildBoard()
{
    var board = document.getElementById("board");
    for (var i = 0; i < 9; i++) {
        var square = document.createElement('div');
        square.className = "square";
        square.onclick = clickSquare;
        square.id = i;
        board.appendChild(square);
    }
}


// Handler for clicking a square. After every valid click, check for 
// end game, and then execute a computer move if game is still in
// progress.
function clickSquare()
{
    var board = document.getElementById("board");
    if (hasClass(board, "gameOver")) {
        return;
    }

    var isX = hasClass(this, "xSquare");
    var isO = hasClass(this, "oSquare");
    if (!isX && !isO) {
        var textNode = document.createTextNode("X");
        this.appendChild(textNode);
        this.className += " xSquare";
    } else {
        return;
    }

    var endGame = checkEndgame();
    if (endGame == 0) {
        computerMove();
    } else {
        finishGame(endGame);
    }
}


// Execute the computer's next move.
function computerMove()
{
    // If this is the first computer move, pick middle (or corner square if
    // already taken) since getNextMove() takes a long time on the first move.
    if (countFilledSquares() == 1) {
        var square = document.getElementById(4);
        if (hasClass(square, "xSquare") ||
            hasClass(square, "oSquare")) {
            square = document.getElementById(0);
        }

        var textNode = document.createTextNode("O");
        square.appendChild(textNode);
        square.className += " oSquare";

        // No need to check for end game since that is impossible.
    } else {
        var move = getNextMove(true);

        var square = document.getElementById(move[0]);
        var textNode = document.createTextNode("O");
        square.appendChild(textNode);
        square.className += " oSquare";

        var endGame = checkEndgame();
        if (endGame != 0) {
            finishGame(endGame);
        }
    }
}


// Count the number of squares that have an X or O.
function countFilledSquares()
{
    var count = 0;
    for (var i = 0; i < 9; i++) {
        var square = document.getElementById(i);
        if (hasClass(square, "xSquare") ||
            hasClass(square, "oSquare")) {
            count += 1;
        }
    }

    return count;
}


// Use minimax to determine the next computer move. Return number of square
// that computer has decided to make a move on.
// Returns an array of [best move (square id), best move].
function getNextMove(myMove)
{
    var bestMove = -1;
    var bestScore;
    if (myMove) {
        bestScore = -1;
    } else {
        bestScore = 1;
    }

    for (var i = 0; i < 9; i++) {
        var square = document.getElementById(i);
        if (hasClass(square, "xSquare") ||
            hasClass(square, "oSquare")) {
            continue;
        }

        if (myMove) {
            // myMove is from the perspective of the computer.
            square.className += " oSquare";
        } else {
            square.className += " xSquare";
        }

        var score = 0;
        var endGame = checkEndgame();
        if (endGame == 1) {
            // Player wins, negative score for computer.
            score = -1; 
        } else if (endGame == 2) {
            // Computer wins, positive score for computer.
            score = 1;
        } else if (endGame == 3) {
            // Tie game, neutral score for computer.
            score = 0;
        } else {
            // Recursively call the algorithm, flipping the player,
            // until we get an end game.
            move = getNextMove(!myMove);
            score = move[1];
        }

        // Revert that move since we don't actually execute the move
        // until after this method returns.
        square.className = "square";

        if (myMove) {
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        } else {
            if (score < bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return [bestMove, bestScore];
}


// Checks if the game is over.
// Returns 0 if not over.
//         1 if player won.
//         2 if computer won.
//         3 if tie game.
function checkEndgame()
{
    var victory = false;
    var squares = getWinningSquares("xSquare");
    if (squares[0] >= 0) {
        victory = true;
    }

    var loss = false;
    if (!victory) {
        squares = getWinningSquares("oSquare");
        if (squares[0] >= 0) {
            loss = true;
        }
    }

    var draw = false;
    if (!victory && !loss && (countFilledSquares() == 9)) {
        draw = true;
    }

    if (victory) {
        return 1;
    } else if (loss) {
        return 2;
    } else if (draw) {
        return 3;
    } else {
        return 0;
    }
}


// Checks if player or computer has won by checking for presence of 'cls'
// className in three adjacent squares. Returns three winning squares
// if a win has been recorded, or [-1, -1, -1] otherwise.
// Return an array of [square1, square2, square3]
function getWinningSquares(cls)
{
    var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                         [0, 3, 6], [1, 4, 7], [2, 5, 8],
                         [0, 4, 8], [2, 4, 6]];

    for (var i = 0; i < winningCombos.length; i++) {
        var square0 = document.getElementById(winningCombos[i][0]);
        var square1 = document.getElementById(winningCombos[i][1]);
        var square2 = document.getElementById(winningCombos[i][2]);

        if (hasClass(square0, cls) &&
            hasClass(square1, cls) &&
            hasClass(square2, cls)) {
            return winningCombos[i];
        } 
    }

    return [-1, -1, -1];
}


// Adds some endgame text and colors the winning/losing row/column/diagonal.
function finishGame(result)
{
    if (result == 0) {
        return;
    }

    var board = document.getElementById("board");
    var endGameText = document.createElement("div");
    endGameText.className = "endGameText";

    if (result == 1) {
        var textNode = document.createTextNode("Congratulations, you have won!");
        endGameText.appendChild(textNode);
        board.appendChild(endGameText);
        board.className += " gameOver";

        var squares = getWinningSquares("xSquare");

        for (var i = 0; i < squares.length; i++) {
            document.getElementById(squares[i]).className += " winningSquare";
        }
    } else if (result == 2) {
        var textNode = document.createTextNode("Sorry, you have been defeated!");
        endGameText.appendChild(textNode);
        board.appendChild(endGameText);
        board.className += " gameOver";

        var squares = getWinningSquares("oSquare");

        for (var i = 0; i < squares.length; i++) {
            document.getElementById(squares[i]).className += " losingSquare";
        }
    } else if (result == 3) {
        var textNode = document.createTextNode("Tie game!");
        endGameText.appendChild(textNode);
        board.appendChild(endGameText);
        board.className += " gameOver";
    }
}


// Helper function to check if an element has a class named 'cls.'
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

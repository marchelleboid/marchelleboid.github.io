window.onload = function() {
    buildBoard();
}


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
            square.className += " oSquare";
        } else {
            square.className += " xSquare";
        }

        var score = 0;
        var endGame = checkEndgame();
        if (endGame == 1) {
            score = -1; 
        } else if (endGame == 2) {
            score = 1;
        } else if (endGame == 3) {
            score = 0;
        } else {
            move = getNextMove(!myMove);
            score = move[1];
        }

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


function checkEndgame()
{
    var square0 = document.getElementById("0");
    var square1 = document.getElementById("1");
    var square2 = document.getElementById("2");
    var square3 = document.getElementById("3");
    var square4 = document.getElementById("4");
    var square5 = document.getElementById("5");
    var square6 = document.getElementById("6");
    var square7 = document.getElementById("7");
    var square8 = document.getElementById("8");

    var victory = false;
    var loss = false;
    // row 1
    if (hasClass(square0, "xSquare") &&
        hasClass(square1, "xSquare") &&
        hasClass(square2, "xSquare")) {
        victory = true;
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square1, "oSquare") &&
               hasClass(square2, "oSquare")) {
        loss = true;
    }

    // row 2
    if (hasClass(square3, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square5, "xSquare")) {
        victory = true;
    } else if (hasClass(square3, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square5, "oSquare")) {
        loss = true;
    }

    // row 3
    if (hasClass(square6, "xSquare") &&
        hasClass(square7, "xSquare") &&
        hasClass(square8, "xSquare")) {
        victory = true;
    } else if (hasClass(square6, "oSquare") &&
               hasClass(square7, "oSquare") &&
               hasClass(square8, "oSquare")) {
        loss = true;
    }

    // column 1
    if (hasClass(square0, "xSquare") &&
        hasClass(square3, "xSquare") &&
        hasClass(square6, "xSquare")) {
        victory = true;
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square3, "oSquare") &&
               hasClass(square6, "oSquare")) {
        loss = true;
    }

    // column 2
    if (hasClass(square1, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square7, "xSquare")) {
        victory = true;
    } else if (hasClass(square1, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square7, "oSquare")) {
        loss = true;
    }

    // column 3
    if (hasClass(square2, "xSquare") &&
        hasClass(square5, "xSquare") &&
        hasClass(square8, "xSquare")) {
        victory = true;
    } else if (hasClass(square2, "oSquare") &&
               hasClass(square5, "oSquare") &&
               hasClass(square8, "oSquare")) {
        loss = true;
    }

    // diagonal left to right
    if (hasClass(square0, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square8, "xSquare")) {
        victory = true;
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square8, "oSquare")) {
        loss = true;
    }

    // diagonal right to left
    if (hasClass(square2, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square6, "xSquare")) {
        victory = true;
    } else if (hasClass(square2, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square6, "oSquare")) {
        loss = true;
    }

    var draw = false;
    if (!victory && !loss) {
        if ((hasClass(square0, "xSquare") || hasClass(square0, "oSquare")) &&
            (hasClass(square1, "xSquare") || hasClass(square1, "oSquare")) &&
            (hasClass(square2, "xSquare") || hasClass(square2, "oSquare")) &&
            (hasClass(square3, "xSquare") || hasClass(square3, "oSquare")) &&
            (hasClass(square4, "xSquare") || hasClass(square4, "oSquare")) &&
            (hasClass(square5, "xSquare") || hasClass(square5, "oSquare")) &&
            (hasClass(square6, "xSquare") || hasClass(square6, "oSquare")) &&
            (hasClass(square7, "xSquare") || hasClass(square7, "oSquare")) &&
            (hasClass(square8, "xSquare") || hasClass(square8, "oSquare"))) {
            draw = true;
        }
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
    } else if (result == 2) {
        var textNode = document.createTextNode("Sorry, you have been defeated!");
        endGameText.appendChild(textNode);
        board.appendChild(endGameText);
        board.className += " gameOver";
    } else if (result == 3) {
        var textNode = document.createTextNode("Tie game!");
        endGameText.appendChild(textNode);
        board.appendChild(endGameText);
        board.className += " gameOver";
    }

    var square0 = document.getElementById("0");
    var square1 = document.getElementById("1");
    var square2 = document.getElementById("2");
    var square3 = document.getElementById("3");
    var square4 = document.getElementById("4");
    var square5 = document.getElementById("5");
    var square6 = document.getElementById("6");
    var square7 = document.getElementById("7");
    var square8 = document.getElementById("8");

    // row 1
    if (hasClass(square0, "xSquare") &&
        hasClass(square1, "xSquare") &&
        hasClass(square2, "xSquare")) {
        square0.className += " winningSquare";
        square1.className += " winningSquare";
        square2.className += " winningSquare";
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square1, "oSquare") &&
               hasClass(square2, "oSquare")) {
        square0.className += " losingSquare";
        square1.className += " losingSquare";
        square2.className += " losingSquare";
    }

    // row 2
    if (hasClass(square3, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square5, "xSquare")) {
        square3.className += " winningSquare";
        square4.className += " winningSquare";
        square5.className += " winningSquare";
    } else if (hasClass(square3, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square5, "oSquare")) {
        square3.className += " losingSquare";
        square4.className += " losingSquare";
        square5.className += " losingSquare";
    }

    // row 3
    if (hasClass(square6, "xSquare") &&
        hasClass(square7, "xSquare") &&
        hasClass(square8, "xSquare")) {
        square6.className += " winningSquare";
        square7.className += " winningSquare";
        square8.className += " winningSquare";
    } else if (hasClass(square6, "oSquare") &&
               hasClass(square7, "oSquare") &&
               hasClass(square8, "oSquare")) {
        square6.className += " losingSquare";
        square7.className += " losingSquare";
        square8.className += " losingSquare";
    }

    // column 1
    if (hasClass(square0, "xSquare") &&
        hasClass(square3, "xSquare") &&
        hasClass(square6, "xSquare")) {
        square0.className += " winningSquare";
        square3.className += " winningSquare";
        square6.className += " winningSquare";
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square3, "oSquare") &&
               hasClass(square6, "oSquare")) {
        square0.className += " losingSquare";
        square3.className += " losingSquare";
        square6.className += " losingSquare";
    }

    // column 2
    if (hasClass(square1, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square7, "xSquare")) {
        square1.className += " winningSquare";
        square4.className += " winningSquare";
        square7.className += " winningSquare";
    } else if (hasClass(square1, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square7, "oSquare")) {
        square1.className += " losingSquare";
        square4.className += " losingSquare";
        square7.className += " losingSquare";
    }

    // column 3
    if (hasClass(square2, "xSquare") &&
        hasClass(square5, "xSquare") &&
        hasClass(square8, "xSquare")) {
        square2.className += " winningSquare";
        square5.className += " winningSquare";
        square8.className += " winningSquare";
    } else if (hasClass(square2, "oSquare") &&
               hasClass(square5, "oSquare") &&
               hasClass(square8, "oSquare")) {
        square2.className += " losingSquare";
        square5.className += " losingSquare";
        square8.className += " losingSquare";
    }

    // diagonal left to right
    if (hasClass(square0, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square8, "xSquare")) {
        square0.className += " winningSquare";
        square4.className += " winningSquare";
        square8.className += " winningSquare";
    } else if (hasClass(square0, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square8, "oSquare")) {
        square0.className += " losingSquare";
        square4.className += " losingSquare";
        square8.className += " losingSquare";
    }

    // diagonal right to left
    if (hasClass(square2, "xSquare") &&
        hasClass(square4, "xSquare") &&
        hasClass(square6, "xSquare")) {
        square2.className += " winningSquare";
        square4.className += " winningSquare";
        square6.className += " winningSquare";
    } else if (hasClass(square2, "oSquare") &&
               hasClass(square4, "oSquare") &&
               hasClass(square6, "oSquare")) {
        square2.className += " losingSquare";
        square4.className += " losingSquare";
        square6.className += " losingSquare";
    }
}


function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
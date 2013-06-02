//This object acts as a data structure that is made up of square that store all the pieces. 
//It has functions that can return information about the board.
"use strict";

function Board(grid) {
    this.grid = grid;
    this.promoPosition = undefined;
}
Board.prototype.showPieces = function showPieces() {
    var message = "The current pieces on the board are: ";
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            if (this.grid[j][i].piece !== null && !this.grid[j][i].piece.captured) {
                message += this.grid[j][i].piece.color + " " + this.grid[j][i].piece.type + ", ";
            }
        }
    }
    alert(message);
}
Board.prototype.removePiece = function removePiece(id) {
    for (var i = 0; i < this.grid.length; i++) {
        if (this.grid[i].id === id) {
            this.grid[i].captured = true;
            break;
        }
    }
}
//Pass me a square's x and y coordinates and I'll return the piece on that square. Null if not any
Board.prototype.getPiece = function getPiece(x, y) {
    if (this.isOnBoard(new Position(x, y))) {
        return this.grid[x][y].getContents();
    } else {
        return null;
    }
}
//TODO If destination is enemy piece, don't null out, but set to captured and move out of the way.
Board.prototype.movePiece = function movePiece(oldPosition, newPosition) {
    this.removeFlair();
    this.removeForks();
    var oldX = oldPosition.x;
    var oldY = oldPosition.y;
    var newX = newPosition.x;
    var newY = newPosition.y;
    var message = undefined;
    var submitted = undefined;
    var piece = this.grid[oldX][oldY].piece;
    var initialAttacks = myGame.attackedPieces(myGame.otherTurn());
    if (this.isLegalMove(oldPosition, newPosition)) {
        this.grid[oldX][oldY].piece = null;
        this.grid[newX][newY].piece = piece;
        this.grid[newX][newY].piece.setMoved(true);
        if(this.isCastling(piece, oldPosition, newPosition)){
            if(newPosition.x - oldPosition.x === 2){
                this.grid[5][oldPosition.y].piece = this.grid[7][oldPosition.y].piece;
                this.grid[7][oldPosition.y].piece = null;
            }else if (newPosition.x - oldPosition.x === -2){
                this.grid[3][oldPosition.y].piece = this.grid[0][oldPosition.y].piece;
                this.grid[0][oldPosition.y].piece = null;
            }
        }
        if ((newPosition.y === 0 || newPosition.y === 7) && this.grid[newPosition.x][newPosition.y].getContents().getImage().indexOf("pawn") !== -1) {
            $("#promotion").show();
            submitted = false;
            $("#board").off();
            $("#submit").on("click", function() {
                if(myGame.gameBoard.promoPosition != undefined){
                    var pieceType = $("#promotionOptions").val();
                    if (pieceType === "Queen") {
                        myGame.gameBoard.grid[myGame.gameBoard.promoPosition.x][myGame.gameBoard.promoPosition.y].piece = new Queen(myGame.whoseTurn());
                    } else if (pieceType === "Rook") {
                        myGame.gameBoard.grid[myGame.gameBoard.promoPosition.x][myGame.gameBoard.promoPosition.y].piece = new Rook(myGame.whoseTurn());
                    } else if (pieceType === "Bishop") {
                        myGame.gameBoard.grid[myGame.gameBoard.promoPosition.x][myGame.gameBoard.promoPosition.y].piece = new Bishop(myGame.whoseTurn());
                    } else if (pieceType === "Knight") {
                        myGame.gameBoard.grid[myGame.gameBoard.promoPosition.x][myGame.gameBoard.promoPosition.y].piece = new Knight(myGame.whoseTurn());
                    }
                    $("#promotion").hide();
                    submitted = true;
                    $("#board").on("click", "td", boardClicks);
                    myGame.turn++;
                    myGame.gameBoard.promoPosition = undefined;
                    layoutBoard();
                }
            });
        }
        
        var afterAttacks = myGame.attackedPieces(myGame.otherTurn());
        this.addFlair(initialAttacks, afterAttacks);
        this.addForks();
        if (submitted === undefined) {
            myGame.turn++;
        } else {
            this.promoPosition = new Position(newPosition.x, newPosition.y);
        }
        layoutBoard();
        message = this.checkStates();
    } else {
        layoutBoard();
        message = 'That is an illegal move!';
    }
    if (message !== undefined) {
        messageUser(message, true);
    }
    this.removeLegalMoves();
}
Board.prototype.removeLegalMoves = function removeLegalMoves(){
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            this.grid[i][j].legalMove = false;
        }
    }
}
Board.prototype.removeForks = function removeForks(){
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            this.grid[i][j].fork = false;
        }
    }
}
Board.prototype.isCastling = function isCastling(piece, oldPosition, newPosition){
    return piece instanceof King && Math.abs(newPosition.x - oldPosition.x) === 2;
}
Board.prototype.addFlair = function addFlair(initialAttacks, afterAttacks) {
    for (var i = afterAttacks.length - 1; i >= 0; i--) {
        for (var j = initialAttacks.length - 1; j >= 0; j--) {
            if ((afterAttacks[i].x == initialAttacks[j].x) && (afterAttacks[i].y == initialAttacks[j].y)) {
                initialAttacks.splice(j, 1);
                afterAttacks.splice(i, 1);
                break;
            }
        }
    }
    for (var i = 0; i < afterAttacks.length; i++) {
        myGame.gameBoard.grid[afterAttacks[i].x][afterAttacks[i].y].flair = true;
    }
}
Board.prototype.addForks = function addForks() {
    var forks = myGame.getWhiteForks();
    for(var i = 0; i < forks.length; i++){
        this.grid[forks[i].x][forks[i].y].fork = true;
    }
}
Board.prototype.checkStates = function checkStates() {
    if (myGame.isInStalemate(myGame.whoseTurn())) {
        $("#board").off();
        return "stalemate!";
    } else if (myGame.isInCheck(myGame.whoseTurn())) {
        if (myGame.isInCheckmate(myGame.whoseTurn())) {
            $("#board").off();
            return "checkmate!";
        }
        return "check!";
    }
}
Board.prototype.occupiedBy = function occupiedBy(position) {
    var x = position.x;
    var y = position.y;
    if (this.getPiece(x, y) == null) {
        return null;
    } else {
        return this.getPiece(x, y).getColor();
    }
}
Board.prototype.isLegalMove = function isLegalMove(oldPosition, newPosition) {
    var oldX = oldPosition.x;
    var oldY = oldPosition.y;
    var newX = newPosition.x;
    var newY = newPosition.y;
    var piece = this.grid[oldX][oldY].piece;
    var legalMoves = myGame.pieceLegalMoves(oldPosition);
    var moved = false;
    var initialAttacks = myGame.attackedPieces(myGame.otherTurn());
    for (var i = 0; i < legalMoves.length; i++) {
        if (legalMoves[i].x == newX && legalMoves[i].y == newY) {
            return true;
        }
    }
    return false;
}
// Returns whether the given position is on the board
Board.prototype.isOnBoard = function isOnBoard(position) {
    return !(position.x < 0 || position.x > 7 || position.y < 0 || position.y > 7);
}
Board.prototype.getPosition = function getPosition(piece) {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            if (this.grid[j][i].piece === piece) {
                return new Position(j, i);
            }
        }
    }
    return new Position(piece.x, piece.y);
}
Board.prototype.getKing = function getKing(player) {
    if (player == "white") {} else {}
}
Board.prototype.testMove = function testMove(testBoard, oldPosition, newPosition) {
    var oldX = oldPosition.x;
    var oldY = oldPosition.y;
    var newX = newPosition.x;
    var newY = newPosition.y;
    var piece = testBoard.gameBoard.grid[oldX][oldY].piece;

    testBoard.gameBoard.grid[oldX][oldY].piece = null;
    testBoard.gameBoard.grid[newX][newY].piece = piece;
}
Board.prototype.removeFlair = function removeFlair() {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            this.grid[i][j].flair = false;
        }
    }
};

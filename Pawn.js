"use strict";
function Pawn(color) {
    this.color = color;
    this.captured = false;
    this.hasMoved = false;
    this.image = color + "_pawn.svg";
}
Pawn.prototype.getColor = function getColor(){
    return this.color;
}
Pawn.prototype.getImage = function getImage(){
    return this.image;
}
Pawn.prototype.isCaptured = function isCaptured(){
    return this.captured;
}
Pawn.prototype.setMoved = function setMoved(movedState){
    this.hasMoved = movedState;
}
Pawn.prototype.getPotentialMoves = function getPotentialMoves(position){
    var x = position.x;
    var y = position.y;
    if(this.color == "white"){
        var potentialMoves = [new Position(x, y - 1)];
        if(!this.hasMoved){
            potentialMoves.push(new Position(x, y - 2));
        }
        potentialMoves.push(new Position(x - 1, y - 1));
        potentialMoves.push(new Position(x + 1, y - 1));
    }else{
        var potentialMoves = [new Position(x, y + 1)];
        if(!this.hasMoved){
            potentialMoves.push(new Position(x, y + 2));
        }
        potentialMoves.push(new Position(x - 1, y + 1));
        potentialMoves.push(new Position(x + 1, y + 1));
    }
    return potentialMoves;
}
Pawn.prototype.getLegalMoves = function getLegalMoves(currentPosition){
    var potentialMoves = [];
    var x = currentPosition.x;
    var y = currentPosition.y;
    if(this.color == "white"){
        if(myGame.gameBoard.occupiedBy(new Position(x, y - 1)) == null){
            potentialMoves.push(new Position(x, y - 1));
            if(!this.hasMoved && myGame.gameBoard.occupiedBy(new Position(x, y - 2)) == null){
                potentialMoves.push(new Position(x, y - 2));
            }
        }
        if(myGame.gameBoard.occupiedBy(new Position(x - 1, y - 1)) == "black"){
            potentialMoves.push(new Position(x - 1, y - 1));
        }
        if(myGame.gameBoard.occupiedBy(new Position(x + 1, y - 1)) == "black"){
            potentialMoves.push(new Position(x + 1, y - 1));
        }
    }else{
        if(myGame.gameBoard.occupiedBy(new Position(x, y + 1)) == null){
            potentialMoves.push(new Position(x, y + 1));
            if(!this.hasMoved && myGame.gameBoard.occupiedBy(new Position(x, y + 2)) == null){
                potentialMoves.push(new Position(x, y + 2));
            }
        }
        if(myGame.gameBoard.occupiedBy(new Position(x - 1, y + 1)) == "white"){
            potentialMoves.push(new Position(x - 1, y + 1));
        }
        if(myGame.gameBoard.occupiedBy(new Position(x + 1, y + 1)) == "white"){
            potentialMoves.push(new Position(x + 1, y + 1));
        }
    }
	// var thisPosition = myGame.gameBoard.getPosition(this);
	// for(var i = potentialMoves.length - 1; i >= 0; i--){
        // var tempGame = myGame.clone();
		// tempGame.gameBoard.testMove(tempGame, thisPosition, new Position(potentialMoves[i].x, potentialMoves[i].y));
		// if(tempGame.isInCheck(myGame.whoseTurn(), tempGame)){
			// potentialMoves.splice[i];
		// }
	// }
    return potentialMoves;
}

Pawn.prototype.getAttacks = function getAttacks(currentPosition){
	var attacks = [];
    var x = currentPosition.x;
    var y = currentPosition.y;
    if(this.color == "white"){
		attacks.push(new Position(x - 1, y - 1));
		attacks.push(new Position(x + 1, y - 1));
	}else{
		attacks.push(new Position(x - 1, y + 1));
		attacks.push(new Position(x + 1, y + 1));
    }
	for(var i = attacks.length - 1; i >= 0; i--){
		if(!myGame.gameBoard.isOnBoard(attacks[i])){
			attacks.splice(i, 1);
		}
	}
    return attacks;
};
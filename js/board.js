(function() {
  window.SnakeGame = window.SnakeGame || {};

  var Board = window.SnakeGame.Board = function () {
    this.snake = new SnakeGame.Snake();
  }
  Board.SIZE = 20;
  Board.prototype.render = function() {
    var rowString;
    for (var row = 0; row < Board.SIZE; row++ ){
      rowString = "";
      for (var col = 0; col < Board.SIZE; col++) {
        if (this.hasSnake( [row, col] )) {
          rowString += "S";
        } else {
          rowString += ".";
        }
      };
    }
  }

  Board.prototype.hasSnake = function (pos) {
    for(var i = 0; i < this.snake.segments.length ; i++){
      var snakePos = this.snake.segments[i];
      if (snakePos[0] === pos[0] && snakePos[1] === pos[1]){
        return true;
      }
    }
    return false;
  };
})();

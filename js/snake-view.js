(function() {
  window.SnakeGame = window.SnakeGame || {};

  var View = SnakeGame.View = function(){
    this.board = new SnakeGame.Board();
  };

  View.prototype.step = function(){
    var board = this.board

    setInterval(function(){
      board.render();
      board.snake.move();
    }, 1000);
  };
})();

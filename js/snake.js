(function() {
  window.SnakeGame = window.SnakeGame || {};

  var Snake = window.SnakeGame.Snake = function() {
    this.dir = [-1, 0];
    this.segments = [[10, 10], [11, 10], [12, 10]];
  }

  Snake.DIRECTIONS = [[0, -1], [0, 1], [1, 0], [-1, 0]]

  Snake.prototype.move = function() {
    this.segments.pop();
    var first = this.segments[0];
    var pos = [first[0] + this.dir[0], first[1] + this.dir[1]];
    this.segments.unshift(pos);
  }

  Snake.prototype.turn = function(dir) {
    this.dir = dir;
  };
})();

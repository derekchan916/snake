(function() {
  window.SnakeGame = window.SnakeGame || {};

  var Coord = window.SnakeGame.Coord = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Coord.prototype.plus = function(coordObj) {
    return new Coord(this.x + coordObj.x, this.y + coordObj.y);
  };

  Coord.prototype.isEquals = function(coordObj) {
    return ((this.x === coordObj.x) && (this.y === coordObj.y));
  };

  Coord.prototype.isOpposite = function(coordObj) {
    if (this.x == (coordObj.x * -1) && (this.y == (coordObj.y * -1))) {
      return true
    }
    return false
  };

  var Board = window.SnakeGame.Board = function(dim) {
    this.dim = dim;
    this.snake1Points = 0;
    this.snake2Points = 0;
    // this.startGame();
  };

  Board.prototype.collectPoints = function() {
    this.snake1Points += this.snake1.points
    this.snake2Points += this.snake2.points
  }

  Board.prototype.startGame = function() {
    this.snake1 = new Snake(this, Math.floor(this.dim/2), Math.floor(this.dim*0.95), "W");
    this.snake2 = new Snake(this, Math.floor(this.dim/2), Math.floor(this.dim*0.05), "E");
    this.snakes = [this.snake1, this.snake2]
    this.bait = new Bait(this);
  };

  Board.prototype.validPosition = function(coordObj) {
    return (coordObj.x >= 0) &&
            (coordObj.x < this.dim) &&
             (coordObj.y >= 0) &&
              (coordObj.y < this.dim)
  };

  var Snake = window.SnakeGame.Snake = function(board, startPosx, startPosy, startDir) {
    this.board = board;
    this.dir = startDir;
    this.segments = [new Coord(startPosx, startPosy)];
    this.growth = 0;
    this.turning = false;
    this.points = 0;
  }

  Snake.DIRECTIONS = {
    "N": new Coord(-1, 0),
    "E": new Coord(0, 1),
    "S": new Coord(1, 0),
    "W": new Coord(0, -1)
  };

  Snake.prototype.move = function() {
    var head = this.segments[this.segments.length - 1];
    var newSeg = head.plus(Snake.DIRECTIONS[this.dir]);
    this.turning = false;
    this.segments.push(newSeg);
    if (this.growth > 0) {
      this.growth -= 1;
    } else {
      this.segments.shift();
    }
    this.eatPossible();
    this.isDead();
    this.board.collectPoints();
    this.points = 0;
  };

  Snake.prototype.turn = function(dir) {
    // debugger
    if (Snake.DIRECTIONS[this.dir].isOpposite(Snake.DIRECTIONS[dir]) || this.turning) {
      return false
    } else {
      this.turning = true;
      this.dir = dir;
    }
  };

  Snake.prototype.present = function(coord) {
    var ans = false
    this.segments.forEach(function(segment) {
      if ((segment.x === coord[0]) && (segment.y === coord[1])) {
        ans = true
      }
    })
    return ans
  };

  Snake.prototype.eatPossible = function() {
    var head = this.segments[this.segments.length - 1];
    if (head.isEquals(this.board.bait.position)) {
      this.growth += SnakeGame.growthRate
      this.board.bait.generate();
      this.points += SnakeGame.BaitPoints;
    }
  }

  Snake.prototype.isDead = function() {
    var head = this.segments[this.segments.length - 1];
    var that = this;
    if (!this.board.validPosition(head)) {
      this.segments = [];
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (head.isEquals(this.segments[i])) {
        that.segments = [];
      }
    }

    this.board.snakes.forEach(function(snake){
      // debugger
      if (that !== snake) {
        for (var i = 0; i < snake.segments.length; i++) {
          if (head.isEquals(snake.segments[i])) {
            that.segments = [];
          }
        }
      }
    })
  }

  var Bait = window.SnakeGame.Bait = function(board) {
    this.board = board;
    this.generate();
  };

  Bait.prototype.generate = function() {
    var dim = this.board.dim
    var x = Math.floor(Math.random() * dim);
    var y = Math.floor(Math.random() * dim);

    this.board.snakes.forEach(function(snake) {
      while (snake.present([x, y])) {
        x = Math.floor(Math.random() * dim);
        y = Math.floor(Math.random() * dim);
      }
    })
    this.position = new Coord(x, y)
  }
})();

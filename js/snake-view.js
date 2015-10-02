(function() {
  window.SnakeGame = window.SnakeGame || {};

  var View = SnakeGame.View = function($el, $rootEl){
    this.$el = $el;
    this.$rootEl = $rootEl;
    this.board = new SnakeGame.Board(SnakeGame.dim);
    this.buildBoard();
    this.gamePaused = true;
    var that = this;

    $('body').on("click", "button", this.handleStartGame.bind(this));
  };

  View.prototype.handleKey = function(e) {
    e.preventDefault();

    keysSnake1 = {
      38: "N",
      39: "E",
      40: "S",
      37: "W"
    }

    keysSnake2 = {
      87: "N",
      68: "E",
      83: "S",
      65: "W"
    }

    pauseKey = 32

    if (keysSnake1[e.keyCode]) {
      this.board.snake1.turn(keysSnake1[e.keyCode]);
    }

    if (keysSnake2[e.keyCode]) {
      this.board.snake2.turn(keysSnake2[e.keyCode])
    }

    if (e.keyCode == pauseKey) {
      this.pauseGame();
    }
  }

  View.prototype.handleStartGame = function(e) {
    e.preventDefault();

    $('.game-paused').toggleClass('show');
    $('#restart').toggleClass('show');
    $(window).on("keydown", this.handleKey.bind(this));
    this.gamePaused = true;
    this.board.startGame();
  }

  View.prototype.pauseGame = function() {
    $('.game-paused').toggleClass('show');

    var that = this;
    this.gamePaused = (this.gamePaused == false ? true : false)

    if (this.gamePaused) {
      window.clearInterval(this.timer)
    } else {
      this.timer = window.setInterval(function(){
        that.step()
      }, SnakeGame.MillSpeed);
    }
  };

  View.prototype.buildBoard = function() {
    var html = "";

    for (var i = 0; i < this.board.dim; i++) {
      html += "<ul>";
      for (var j = 0; j < this.board.dim; j++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function(){
    var that = this;
    $('.snake1-points').html('Player Blue<br>' + this.board.snake1Points)
    $('.snake2-points').html('Player Red<br>' + this.board.snake2Points)

    this.board.snakes.forEach(function(snake) {
      if (snake.segments.length > 0) {
        snake.move();
        that.render();
      } else {
        that.board.snakes.forEach(function(snake) {
          if (snake.segments.length > 0) {
            snake.points += SnakeGame.LifePoints;
            that.board.collectPoints();
            snake.points = 0;
            $('.snake1-points').html('Player Blue<br>' + that.board.snake1Points)
            $('.snake2-points').html('Player Red<br>' + that.board.snake2Points)
          }
        })

        $(window).off("keydown");
        $('#restart').toggleClass('show');
        window.clearInterval(that.timer);
      }
    })
  };

  View.prototype.render = function() {
    this.renderClasses([this.board.bait.position], "bait");
    this.renderClasses(this.board.snake1.segments, "snake1");
    this.renderClasses(this.board.snake2.segments, "snake2");
  };

  View.prototype.renderClasses = function(segments, className) {
    this.$li.filter("." + className).removeClass();

    segments.forEach(function(segment){
      var coord = (segment.x * this.board.dim) + segment.y;
      this.$li.eq(coord).addClass(className);
    }.bind(this));
  };
})();

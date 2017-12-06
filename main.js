// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var para = document.querySelector('p');

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

//Shape object constructor
function Shape(x, y, velX, velY, existence) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.existence = existence;
}

// Ball object contructor
function Ball(x, y, velX, velY, existence, color, size) {
  Shape.call(this, x, y, velX, velY, existence);
  
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// Ball Methods
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}
Ball.prototype.update = function () {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}
Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance =  Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

// Evil circle constructor
function EvilCircle(x, y, existence) {
  Shape.call(this, x, y, existence);

  this.color = 'white';
  this.size = 25;
  this.velX = 25;
  this.velY = 25;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

//EvilCircle Methods
EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}
// no bounds version
EvilCircle.prototype.checkBounds = function () {
  if ((this.x) >= width - 1 ) {
    this.x = 1;
  }

  if ((this.x) <= 0) {
    this.x = width;
   }

  if ((this.y ) >= height - 1) {
    this.y = 1;
  }

  if ((this.y) <= 0) {
    this.y = height;
  }

  //Bounds version: 
  //   if ((this.x + this.size) >= width) {
  //     this.x = (this.x) - 10;
  //   }

  //   if ((this.x - this.size) <= 0) {
  //     this.x = +(this.x) + 10;
  //   }

  //   if ((this.y + this.size) >= height) {
  //     this.y = (this.y) - 10;
  //   }

  //   if ((this.y - this.size) <= 0) {
  //     this.y = +(this.y) + 10;
  //   }
}
EvilCircle.prototype.setControls = function () {
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }
}
EvilCircle.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(balls[j].existence === false)) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance =  Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].existence = false;
        decreaseBallsCounter(); 
      }
    }
  }
}

/// Game Loop ///

var balls = [];
var evilCircle;
var ballsLeft = 0;
var ballsCounter = document.getElementById('ballscounter');

function increaseBallsCounter () {
  ballsLeft++;
  ballsCounter.innerHTML = ballsLeft;
}

function decreaseBallsCounter () {
  ballsLeft--;
  ballsCounter.innerHTML = ballsLeft;
}

function loop() {
  
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < 25) {
    var ball = new Ball (
      random(0, width),
      random(0, height),
      random(-5, 5),
      random(-5, 5),
      true,
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      random(10, 20)
    );
    balls.push(ball);
    increaseBallsCounter();
  }

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].existence === true) { 
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  if (evilCircle === undefined) {
    evilCircle = new EvilCircle (
      random(0, width),
      random(0, height),
      true
    );
  }

  evilCircle.setControls();
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

// Activate game
canvas.onclick = function () {
  loop();
  return false;
}


// setup canvas

var html = document.querySelector('html');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var para = document.querySelector('p');
var instructions = document.getElementById('instructions');

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
Ball.prototype.checkBounds = function () {
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
  
}
Ball.prototype.updateSpeed = function () {
  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance =  Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size && balls[j].existence === true) {
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
  this.velX = 0;
  this.velY = 0;
  this.friction = 0.95;
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
  if ((this.x) >= width + 50 ) {
    this.x = 0;
  }

  if ((this.x) <= -50) {
    this.x = width;
   }

  if ((this.y ) >= height + 50) {
    this.y = 0;
  }

  if ((this.y) <= -50) {
    this.y = height;
  }
}
EvilCircle.prototype.setControls = function () {
  var _this = this;
  var wKey = 87;
  var sKey = 83;
  var aKey = 65;
  var dKey = 68;
  var maxSpeed = 15;
  
  window.onkeydown = function(e) {
    if (e.keyCode === aKey) {
      _this.velX -= 2;
    } else if (e.keyCode === dKey) {
      _this.velX += 2;
    } else if (e.keyCode === wKey) {
      _this.velY -= 2;
    } else if (e.keyCode === sKey) {
      _this.velY += 2;
    }
  }
}
EvilCircle.prototype.updateSpeed = function () {
  this.velX *= this.friction
  this.velY *= this.friction

  this.x += this.velX
  this.y += this.velY
}
EvilCircle.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(balls[j].existence === false)) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance =  Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        var idx = balls.indexOf(balls[j])
        balls[j].existence = false;
        balls.splice(idx, 1);
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

function spawnBalls() {
  for (var z = 0; z < 50; z++) {
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
}

function loop() { 
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, width, height);

  for (var i = 0; i < balls.length; i++) {
    if (balls[i].existence === true) { 
      balls[i].draw();
      balls[i].updateSpeed();
      balls[i].checkBounds();
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
  evilCircle.updateSpeed();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

// Activate game
html.onclick = function () {
  instructions.style.display = "none";
  spawnBalls();
  loop();
  return false;
}


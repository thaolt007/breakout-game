/**
 * Created by dieuhau on 20/01/2018.
 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var cvW = canvas.width;
var cvH = canvas.height;
var x = Math.ceil(Math.random()*cvW);
var y = Math.ceil(Math.random()*cvH);
var radius = 10;
var dx = 2; var dy = -2;
var paddleWidth = 100; var paddleHeight = 10;
var paddleX = Math.ceil(Math.random()*cvW);
var right = false; var left = false;
var paddleMove = 5;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    //console.log(e.keyCode);
    if(e.keyCode == 39) right = true;
    else if(e.keyCode == 37) left = true;
}
function keyUpHandler(e) {
    //console.log(e.keyCode);
    if(e.keyCode == 39) right = false;
    else if(e.keyCode == 37) left = false;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x,y,radius,0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, cvH - paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}

function isGameOver() {
    if(y + radius >= cvH) {
        if (x + radius < paddleX || x > paddleX + paddleWidth){
            return true;
        }else {
            y = cvH - paddleHeight - radius;
        }
    }
    return false;
}
function draw() {
    ctx.clearRect(0, 0, cvW, cvH);
    drawBall();
    drawPaddle();
    x += dx;
    y += dy;

    if(x + radius >= cvW || x - radius <= 0) {
        dx = -dx;
    }
    if(y + radius >= cvH || y - radius <= 0) {
        dy = -dy;
    }

    if(right && paddleX + paddleWidth < cvW) paddleX += paddleMove;
    else if(paddleX + paddleWidth > cvW) paddleX = cvW - paddleWidth;

    if(left && paddleX > 0) paddleX -= paddleMove;
    else if(paddleX < paddleMove) paddleX = 0;

    if(isGameOver()) {
        console.log("game over");
        alert("Game over");
        clearInterval(game);
        document.location.reload();
    }
}

var game = setInterval(draw, 10);



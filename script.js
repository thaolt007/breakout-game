/**
 * Created by dieuhau on 20/01/2018.
 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var cvW = canvas.width;
var cvH = canvas.height;

// paddle
var paddleWidth = 100; var paddleHeight = 10;
var paddleX = Math.ceil(Math.random()*cvW);
var right = false; var left = false;
var paddleMove = 15;
// ball
var dx = 7; var dy = -7; // hướng di chuyển: lên trên bên phải
var x = cvW/2; // vị trí x của quả bóng
var y = cvH/2; // vị trí y của quả bóng
var radius = 30;
var ball = new Image();
ball.src = "https://goo.gl/7QuhZ4";
// brick
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickColumn = 8;
var brickRow = 3;
var brickTopOffset = 30;
var brickLeftOffset = 28;
var bricks = [];
// scores
var score = 0;
// level
var level = 1;
var maxLevel = 5;
// live
var live = 3;

initBricks();
function initBricks() {
    for(var r = 0; r < brickRow; r++) {
        bricks[r] = [];
        for(var c = 0; c < brickColumn; c++) {
            bricks[r][c] = {x:0, y:0, state:1}; // state=1: vẫn còn; state=0: đã mất
        }
    }
}

function drawBricks() {
    for(var r = 0; r < brickRow; r++) {
        for(var c = 0; c < brickColumn; c++) {
            var brickX = c * (brickWidth + brickPadding) + brickLeftOffset;
            var brickY = r * (brickHeight + brickPadding) + brickTopOffset;
            bricks[r][c].x = brickX;
            bricks[r][c].y = brickY;
            if (bricks[r][c].state) {
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'blue';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
// Bắt bấm phím sang trái, sang phải
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
    //ctx.drawImage(ball, x, y, radius, radius);
}
// Vẽ tấm ván ở dưới
function drawPaddle() {
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(paddleX, cvH - paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}

function isLose() {
    if(y + radius >= cvH) {
        if(x + radius < paddleX || x > paddleX + paddleWidth){
            score = 0;
            return true;
        }else {
            y = cvH - paddleHeight - radius;
        }
    }
    return false;
}

function isWin() {
    if(score == brickRow * brickColumn) return true;
    return false;
}

function collisionDectect() {
    for(var r = 0; r < brickRow; r++) {
        for(var c = 0; c < brickColumn; c++) {
            if(bricks[r][c].state) {
                if(x >= bricks[r][c].x && x <= bricks[r][c].x + brickWidth &&
                    y-radius >= bricks[r][c].y && y-radius <= bricks[r][c].y + brickHeight) {
                    dy = -dy;
                    bricks[r][c].state = 0;
                    ++score;
                }
            }
        }
    }
}

function drawScore() {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillText('Score: '+score.toString(), brickLeftOffset, brickTopOffset-5);
    ctx.font = '20pt Arial';
    ctx.closePath();
}
// Bắt di chuột
document.addEventListener('mousemove', mouseMoveHandler);
function mouseMoveHandler(e) {
    var mouseX = e.clientX - canvas.offsetLeft;
    if (mouseX > 0 && mouseX < cvW) {
        paddleX = mouseX - paddleWidth/2;
    }
}
function drawLevel() {
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.fillText('Level: '+level.toString(), cvW/2-45, brickTopOffset-5);
    ctx.font = '20pt Arial';
    ctx.closePath();
}

function drawLive() {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillText('Lives: '+live.toString(), cvW-115, brickTopOffset-5);
    ctx.font = '20pt Arial';
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, cvW, cvH);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLevel();
    drawLive();
    x += dx;
    y += dy;
    collisionDectect();
    // Chuyển hướng khi đến các cạnh hình hộp
    if(x + radius >= cvW || x - radius <= 0) {
        dx = -dx;
    }
    if(y + radius >= cvH || y - radius <= 0) {
        dy = -dy;
    }
    // Cập nhật vị trí tấm ván khi bấm phím trái, phải
    if(right && paddleX + paddleWidth < cvW) paddleX += paddleMove;
    else if(paddleX + paddleWidth > cvW) paddleX = cvW - paddleWidth;

    if(left && paddleX > 0) paddleX -= paddleMove;
    else if(paddleX < paddleMove) paddleX = 0;

    if(isLose()) {
        live--;
        initBricks();
        if(!live) {
            alert("Game over");
            reloadGame();
        }
    }
    if(isWin()) {
        console.log("Win");
        score = 0;
        dx = (dx < 0) ? dx-=2 : dx+=2;
        dy = (dy < 0) ? dy-=2 : dy+=2;
        if(level == maxLevel) {
            alert("You Win!");
            reloadGame();
        }else {
            initBricks();
            ++level;
        }
        //document.location.reload();
    }
    requestAnimationFrame(draw);
}
// Load lại game khi thua gameover
function reloadGame() {
    score = 0;
    level = 1;
    maxLevel = 5;
    live = 3
    dx = 5;
    dy = -5;
    initBricks();
}
//var game = setInterval(draw, 10);
draw();



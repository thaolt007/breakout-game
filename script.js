/**
 * Created by dieuhau on 20/01/2018.
 */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');


var radius = 10;
var dx = 2; var dy = -2;
var cvW = canvas.width;
var cvH = canvas.height;
var x = Math.ceil(Math.random()*cvW);
var y = Math.ceil(Math.random()*cvH);

setInterval(draw, 10);

var x = 100;
function drawBall() {
    ctx.beginPath();
    ctx.arc(x,y,radius,0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
    x += dx;
    y += dy;

    if(x + radius >= cvW || x - radius <= 0) {
        dx = -dx;
    }
    if(y + radius >= cvH || y - radius <= 0) {
        dy = -dy;
    }
}
function draw() {
    ctx.clearRect(0, 0, cvW, cvH);
    drawBall();
}



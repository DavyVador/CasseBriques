const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const ballRadius = 10;
const paddleHeight = 10;     // Taille de la raquette
const paddleWidth = 75;     // Taille de la raquette  

let x = canvas.width/2;
let y = canvas.height-30;
let dx = 3;
let dy = -4;
let colorBall = "red"
let paddleX = (canvas.width-paddleWidth)/2;     // Point de départ de la raquette
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 10;
let brickColumnCount = 10;
let brickWidth = 40;
let brickHeight = 10;
let brickPadding = 2;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;

let score = 0;
let lives = 3;

let bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function randomInteger(max) {     // crée un nombre aléatoire pour les couleurs de boule
    return Math.floor(Math.random()*(max+1))
}

function randomRgb() {            // crée une couleur aléatoire pour la boule
    let r=randomInteger(255);
    let g=randomInteger(255);
    let b=randomInteger(255);

    return [r,g,b]
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];    // b pour stocker l’objet brique dans la boucle de la détection de collision
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;    // pour compter le score à chaque collision
                    if(score == brickRowCount*brickColumnCount) {
                        alert("C'est gagné, Bravo ! Ne pas oublier l'espace avant le point d'exclamation !!!");
                        document.location.reload();
                }
            }
        }
    }
}
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = colorBall;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#842E1B";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {                       // Disposition des briques
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#842E1B";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score : "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Vies : "+lives, canvas.width-65, 20);
}

function draw() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();     // affiche la raquette à l'écran
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        colorBall = `rgb(${randomRgb()})`;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        colorBall = `rgb(${randomRgb()})`;
    } 
    
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }

                else {
                    x = canvas.width/2;
                    y = canvas.height-30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width-paddleWidth)/2;
                }           
        }

        if(rightPressed && paddleX < canvas.width-paddleWidth) {
            paddleX += 7;
          }
        else if(leftPressed && paddleX > 0) {
            paddleX -= 7;
          }
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();


  

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
// ctx.stroke();
// ctx.closePath();
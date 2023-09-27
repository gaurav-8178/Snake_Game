const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeBody = [];
let snakeX = 5, snakeY = 10;
let speedX = 0, speedY = 0;
let setIntervalId;
let score = 0;

//Getting high score from the local storage.
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = ()=>{
    foodX = Math.floor(Math.random()*30)+1;
    foodY = Math.floor(Math.random()*30)+1;
}

const handleGameOver = ()=>{
    clearInterval(setIntervalId);
    alert("Game Over! Press Enter to restart.");
    location.reload();
}

const changeDirection = (e)=>{
    if(e.key==="ArrowUp" && speedY != 1){
        speedX = 0;
        speedY = -1;
    }else if(e.key==="ArrowDown" && speedY != -1){
        speedX = 0;
        speedY = 1;
    }else if(e.key==="ArrowLeft" && speedX != 1){
        speedX = -1;
        speedY = 0;
    }else if(e.key==="ArrowRight" && speedX != -1){
        speedX = 1;
        speedY = 0;
    }
    initGame();
}

controls.forEach(key=>{
    key.addEventListener("click", ()=> changeDirection({key: key.dataset.key}));
})

const initGame = ()=>{
    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area:${foodY} / ${foodX};"></div>`;

    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for(let i=snakeBody.length-1; i>0; i--){
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeX,snakeY];     // Setting first element to current position

    // Updating snake head's position based on current speed.
    snakeX += speedX;
    snakeY += speedY;

    // Checking if snake's head is out of wall.
    if(snakeX <= 0 || snakeY > 30 || snakeY <= 0 || snakeX > 30){
        gameOver = true;
    }

    for(let i=0; i<snakeBody.length; i++){
        // Adding div for each part of snake's body.
        htmlMarkup += `<div class="snake-head" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]};"></div>`;
        // Checking if snake head hit its body.
        if(i!=0 && snakeBody[0][1]===snakeBody[i][1] && snakeBody[0][0]===snakeBody[i][0]){
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame,125);

document.addEventListener("keydown", changeDirection);
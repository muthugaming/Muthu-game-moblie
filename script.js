const goat = document.getElementById('goat');
const leaf = document.getElementById('leaf');
const bike = document.getElementById('bike');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const retryButton = document.getElementById('retry-button');
const startGameButton = document.getElementById('start-game');
const playerSelection = document.getElementById('player-selection');
const selectGoatButton = document.getElementById('select-goat');
const gameAudio = document.getElementById('game-audio');
const gameArea = document.getElementById('game-area');
const gameOverSound = new Audio('game over.m4a');
const fullscreenButton = document.getElementById('fullscreen-button'); // Full Screen Button

let score = 0;
let goatPosition = 125;
let gameInterval;
const gameSpeed = 10;
let hitCount = 0;

function startGame() {
    score = 0;
    hitCount = 0;
    scoreDisplay.textContent = score;
    gameOverDisplay.style.display = 'none';
    playerSelection.style.display = 'none';
    gameAudio.play();
    resetObject(leaf);
    resetObject(bike);

    gameInterval = setInterval(() => {
        moveObject(leaf);
        moveObject(bike);
        checkCollision();
    }, 20);
}

function checkCollision() {
    let goatRect = goat.getBoundingClientRect();
    let bikeRect = bike.getBoundingClientRect();
    let leafRect = leaf.getBoundingClientRect();

    if (checkRectCollision(goatRect, bikeRect)) {
        handleCollision();
    }

    if (checkRectCollision(goatRect, leafRect)) {
        score += 3;
        scoreDisplay.textContent = score;
        resetObject(leaf);
    }
}

function checkRectCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function handleCollision() {
    if (hitCount < 2) {
        hitCount++;
        blinkPlayer();
    } else {
        gameOver();
        return;
    }

    score -= 3;
    scoreDisplay.textContent = score;
}

function blinkPlayer() {
    goat.style.opacity = '0.5';
    setTimeout(() => {
        goat.style.opacity = '1';
    }, 500);
}

function gameOver() {
    gameOverSound.play();
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    gameOverDisplay.style.display = 'block';
    gameAudio.pause();
}

function resetObject(object) {
    object.style.top = '-150px';
    object.style.left = `${Math.floor(Math.random() * (300 - 10))}px`;
}

function moveObject(object) {
    let currentTop = parseInt(object.style.top);
    object.style.top = `${currentTop + gameSpeed}px`;

    if (currentTop > 800) {
        resetObject(object);
    }
}

// Tap to move goat left or right
function moveGoat(event) {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const tapPositionX = event.clientX - gameAreaRect.left;

    if (tapPositionX < gameAreaRect.width / 2) {
        moveGoatLeft();
    } else {
        moveGoatRight();
    }
}

function moveGoatLeft() {
    goatPosition = Math.max(goatPosition - 50, 0);
    goat.style.left = `${goatPosition}px`;
}

function moveGoatRight() {
    goatPosition = Math.min(goatPosition + 50, gameArea.offsetWidth - goat.offsetWidth);
    goat.style.left = `${goatPosition}px`;
}

gameArea.addEventListener('click', moveGoat);

retryButton.addEventListener('click', () => {
    gameAudio.currentTime = 0;
    gameAudio.play();
    startGame();
});

selectGoatButton.addEventListener('click', () => {
    playerSelection.style.display = 'none';
    startGame();
});

startGameButton.addEventListener('click', startGame);

// Full Screen Toggle
fullscreenButton.addEventListener('click', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameArea.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenButton.textContent = 'Full Screen';
    } else {
        fullscreenButton.textContent = 'Exit Full Screen';
    }
});

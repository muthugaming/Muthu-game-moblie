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
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const gameArea = document.getElementById('game-area');
const gameOverSound = new Audio('game over.m4a'); // Path to your Game Over sound
const retrySound = new Audio(''); // Path to your Retry sound

let score = 0;
let goatPosition = 125; // Starting position of the goat
let gameInterval;
const gameSpeed = 9; // Speed of object movement
let hitCount = 0; // Count of hits

function startGame() {
    score = 0; // Reset score
    hitCount = 0; // Reset hit count
    scoreDisplay.textContent = score;
    gameOverDisplay.style.display = 'none'; // Hide game over screen
    playerSelection.style.display = 'none'; // Hide player selection
    gameAudio.play(); // Start background music
    resetObject(leaf);
    resetObject(bike);
    
    gameInterval = setInterval(() => {
        moveObject(leaf);
        moveObject(bike);
        checkCollision();
    }, 20);
}

// Function to check collisions
function checkCollision() {
    let goatRect = goat.getBoundingClientRect();
    let bikeRect = bike.getBoundingClientRect();
    let leafRect = leaf.getBoundingClientRect();

    // Check collision with bike
    if (checkRectCollision(goatRect, bikeRect)) {
        handleCollision();
    }

    // Check collision with leaf
    if (checkRectCollision(goatRect, leafRect)) {
        score += 3; // Increase score for catching the leaf
        scoreDisplay.textContent = score;
        resetObject(leaf); // Reset leaf position
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
        hitCount++; // Increment hit count
        blinkPlayer(); // Blink effect for the player
    } else {
        // If this is the third hit, game over
        gameOver();
        return;
    }

    score -= 3; // Reduce score by 3
    scoreDisplay.textContent = score;
}

function blinkPlayer() {
    goat.style.opacity = '0.5'; // Reduce visibility
    setTimeout(() => {
        goat.style.opacity = '1'; // Restore visibility
    }, 500); // Blink duration
}

function gameOver() {
    gameOverSound.play(); // Play Game Over sound
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score; // Display final score
    gameOverDisplay.style.display = 'block'; // Show game over screen
    disableButtons(); // Disable movement buttons
    gameAudio.play(); // Stop music on game over
    gameAudio.pause();
}

function resetObject(object) {
    object.style.top = '-150px'; // Start off screen at the top
    object.style.left = `${Math.floor(Math.random() * (300 - 70))}px`; // Random X position
}

function moveObject(object) {
    let currentTop = parseInt(object.style.top);
    object.style.top = `${currentTop + gameSpeed}px`; // Move object down by gameSpeed

    // Reset the object if it goes off the screen
    if (currentTop > 600) { // Assuming game area height is 600px
        resetObject(object);
    }
}

// Movement functions for buttons
function moveGoatLeft() {
    goatPosition = Math.max(goatPosition - 50, 0); // Move left
    goat.style.left = `${goatPosition}px`;
}

function moveGoatRight() {
    goatPosition = Math.min(goatPosition + 50, 290); // Move right
    goat.style.left = `${goatPosition}px`;
}

// Add keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveGoatLeft();
    } else if (event.key === 'ArrowRight') {
        moveGoatRight();
    }
});

// Add click/tap control on the game area
gameArea.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const gameAreaRect = gameArea.getBoundingClientRect();
    const gameAreaCenter = gameAreaRect.left + gameAreaRect.width / 2;

    if (clickX < gameAreaCenter) {
        moveGoatLeft(); // Move left if click is on the left side
    } else {
        moveGoatRight(); // Move right if click is on the right side
    }
});

// Button event listeners
leftButton.addEventListener('click', moveGoatLeft);
rightButton.addEventListener('click', moveGoatRight);

// Disable buttons when game is over
function disableButtons() {
    leftButton.disabled = true;
    rightButton.disabled = true;
}

// Restart game
retryButton.addEventListener('click', () => {
    retrySound.play(); // Play Retry sound
    gameAudio.currentTime = 0; // Reset music to start
    gameAudio.play(); // Restart music
    startGame(); // Restart the game
});

// Player selection
selectGoatButton.addEventListener('click', () => {
    playerSelection.style.display = 'none'; // Hide player selection
    startGame();
});

// Start the game
startGameButton.addEventListener('click', startGame);

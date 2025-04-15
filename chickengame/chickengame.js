// Game Configuration
const gameConfig = {
    chickenStartPosition: { bottom: 20, left: 480 },
    safeZoneTop: 460,
    maxActiveCars: 20,
    carSpawnInterval: 100,
    scoreIncrement: 10,
    movementStep: 50,
    gameAreaBounds: { width: 960, height: 460 }
};

// Game State Variables
let gameInterval;
let score = 0;
let isGameRunning = false;
let activeCars = 0;
let highScore = parseInt(localStorage.getItem('chickenGameHighScore')) || 0;

// DOM Elements
const chicken = document.getElementById('chicken');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

// Initialize high score display
highScoreDisplay.textContent = `High Score: ${highScore}`;

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    
    // Reset chicken position
    chicken.style.bottom = `${gameConfig.chickenStartPosition.bottom}px`;
    chicken.style.left = `${gameConfig.chickenStartPosition.left}px`;
    
    gameInterval = setInterval(spawnCar, gameConfig.carSpawnInterval);
    document.addEventListener('keydown', moveChicken);
}

function checkScore() {
    const currentBottom = parseInt(chicken.style.bottom) || 0;
    if (currentBottom >= gameConfig.safeZoneTop) {
        score += gameConfig.scoreIncrement;
        scoreDisplay.textContent = `Score: ${score}`;
        chicken.style.bottom = `${gameConfig.chickenStartPosition.bottom}px`;
        chicken.style.left = `${gameConfig.chickenStartPosition.left}px`;
    }
}

function spawnCar() {
    if (activeCars >= gameConfig.maxActiveCars) return;
    
    const car = document.createElement('div');
    car.className = 'car';
    
    const spawnFromRight = Math.random() > 0.5;
    car.textContent = '🚗';
    car.style.transform = spawnFromRight ? 'scaleX(1)' : 'scaleX(-1)';
    
    // Check for collision with other cars before spawning
    const newCarTop = Math.random() * 250 + 120;
    const existingCars = document.querySelectorAll('.car');
    
    for (let existingCar of existingCars) {
        const existingTop = parseInt(existingCar.style.top);
        if (Math.abs(existingTop - newCarTop) < 60) {
            return;
        }
    }
    
    car.style.top = `${newCarTop}px`;
    car.style.left = spawnFromRight ? '1000px' : '-60px';
    
    activeCars++;
    gameArea.appendChild(car);
    
    // Calculate speed based on score
    const baseSpeed = 1 + Math.random() * 5;
    const speedMultiplier = 1 + (score / 50); // Increase speed by 2% for every 10 points
    const speed = baseSpeed * speedMultiplier;
    
    const carInterval = setInterval(() => {
        const currentLeft = parseInt(car.style.left);
        if (spawnFromRight) {
            if (currentLeft < -60) {
                clearInterval(carInterval);
                car.remove();
                activeCars--;
            } else {
                car.style.left = `${currentLeft - speed}px`;
            }
        } else {
            if (currentLeft > 1000) {
                clearInterval(carInterval);
                car.remove();
                activeCars--;
            } else {
                car.style.left = `${currentLeft + speed}px`;
            }
        }
        checkCollision(car);
    }, 12);
}

function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('chickenGameHighScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    
    alert(`Game Over! Your score: ${score}\nHigh Score: ${highScore}`);
    
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => car.remove());
    activeCars = 0;
}

function moveChicken(event) {
    if (!isGameRunning) return;
    
    // Prevent default scrolling behavior for arrow keys
    if (event.key.startsWith('Arrow')) {
        event.preventDefault();
    }
    
    const currentLeft = parseInt(chicken.style.left) || 480;
    const currentBottom = parseInt(chicken.style.bottom) || 20;
    
    switch(event.key) {
        case 'ArrowLeft':
            if (currentLeft > 0) {
                chicken.style.left = `${currentLeft - 50}px`;
            }
            break;
        case 'ArrowRight':
            if (currentLeft < 960) {
                chicken.style.left = `${currentLeft + 50}px`;
            }
            break;
        case 'ArrowUp':
            if (currentBottom < 460) {
                chicken.style.bottom = `${currentBottom + 50}px`;
                checkScore();
            }
            break;
        case 'ArrowDown':
            if (currentBottom > 20) {
                chicken.style.bottom = `${currentBottom - 50}px`;
            }
            break;
    }
}

function checkCollision(car) {
    const chickenRect = chicken.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    
    if (chickenRect.left < carRect.right &&
        chickenRect.right > carRect.left &&
        chickenRect.top < carRect.bottom &&
        chickenRect.bottom > carRect.top) {
        endGame();
    }
}
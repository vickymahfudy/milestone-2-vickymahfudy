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
const gameState = {
    score: 0,
    isGameRunning: false,
    activeCars: [],
    highScore: parseInt(localStorage.getItem('chickenGameHighScore')) || 0,
    gameInterval: null
};

// DOM Elements
const chicken = document.getElementById('chicken');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

// Initialize high score display
highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;

function startGame() {
    if (gameState.isGameRunning) return;
    
    gameState.isGameRunning = true;
    gameState.score = 0;
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    
    // Reset chicken position
    chicken.style.bottom = `${gameConfig.chickenStartPosition.bottom}px`;
    chicken.style.left = `${gameConfig.chickenStartPosition.left}px`;
    
    gameState.gameInterval = setInterval(spawnCar, gameConfig.carSpawnInterval);
    document.addEventListener('keydown', moveChicken);
}

function checkScore() {
    const currentBottom = parseInt(chicken.style.bottom) || 0;
    if (currentBottom >= gameConfig.safeZoneTop) {
        gameState.score += gameConfig.scoreIncrement;
        scoreDisplay.textContent = `Score: ${gameState.score}`;
        chicken.style.bottom = `${gameConfig.chickenStartPosition.bottom}px`;
        chicken.style.left = `${gameConfig.chickenStartPosition.left}px`;
    }
}

function spawnCar() {
    if (gameState.activeCars.length >= gameConfig.maxActiveCars) return;
    
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
    
    gameArea.appendChild(car);
    
    // Calculate speed based on score
    const baseSpeed = 1 + Math.random() * 5;
    const speedMultiplier = 1 + (gameState.score / 50);
    const speed = baseSpeed * speedMultiplier;
    
    const carInterval = setInterval(() => {
        const currentLeft = parseInt(car.style.left);
        if (spawnFromRight) {
            if (currentLeft < -60) {
                clearInterval(carInterval);
                car.remove();
                gameState.activeCars = gameState.activeCars.filter(c => c.element !== car);
            } else {
                car.style.left = `${currentLeft - speed}px`;
            }
        } else {
            if (currentLeft > 1000) {
                clearInterval(carInterval);
                car.remove();
                gameState.activeCars = gameState.activeCars.filter(c => c.element !== car);
            } else {
                car.style.left = `${currentLeft + speed}px`;
            }
        }
        checkCollision(car);
    }, 12);

    gameState.activeCars.push({
        element: car,
        interval: carInterval
    });
}

function endGame() {
    gameState.isGameRunning = false;
    clearInterval(gameState.gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('chickenGameHighScore', gameState.highScore);
        highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
    }
    
    alert(`Game Over! Your score: ${gameState.score}\nHigh Score: ${gameState.highScore}`);
    
    // Clear all cars
    gameState.activeCars.forEach(car => {
        clearInterval(car.interval);
        car.element.remove();
    });
    gameState.activeCars = [];
}

function moveChicken(event) {
    if (!gameState.isGameRunning) return;
    
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
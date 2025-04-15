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
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
    startButton.addEventListener('click', startGame);
});

function startGame() {
    if (gameState.isGameRunning) return;
    
    // Hide game over screen if visible
    if (gameOverScreen) {
        gameOverScreen.classList.add('hidden');
    }
    
    // Hide start button during gameplay
    startButton.classList.add('hidden');
    
    gameState.isGameRunning = true;
    gameState.score = 0;
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    
    // Reset chicken position and state
    chicken.style.bottom = `${gameConfig.chickenStartPosition.bottom}px`;
    chicken.style.left = `${gameConfig.chickenStartPosition.left}px`;
    chicken.classList.remove('crashed');
    
    // Clear existing cars safely
    if (gameState.activeCars.length > 0) {
        gameState.activeCars.forEach(car => {
            if (car && car.interval) {
                clearInterval(car.interval);
            }
            if (car && car.element && car.element.parentNode) {
                car.element.remove();
            }
        });
        gameState.activeCars = [];
    }
    
    gameState.gameInterval = setInterval(spawnCar, gameConfig.carSpawnInterval);
    document.addEventListener('keydown', moveChicken);
}

function endGame() {
    if (!gameState.isGameRunning) return;
    
    gameState.isGameRunning = false;
    clearInterval(gameState.gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    // Show start button
    startButton.classList.remove('hidden');
    
    // Update high score
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('chickenGameHighScore', gameState.highScore);
        highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
    }
    
    // Display game over message
    alert(`Game Over! Your score: ${gameState.score}\nHigh Score: ${gameState.highScore}`);
    
    // Clear cars safely
    gameState.activeCars.forEach(car => {
        if (car && car.interval) {
            clearInterval(car.interval);
        }
        if (car && car.element && car.element.parentNode) {
            car.element.remove();
        }
    });
    gameState.activeCars = [];
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

// Helper function to update car position and handle boundaries
function updateCarPosition(car, currentLeft, speed, isMovingLeft) {
    const outOfBounds = isMovingLeft ? currentLeft < -60 : currentLeft > 1000;
    const newPosition = isMovingLeft ? currentLeft - speed : currentLeft + speed;
    
    if (outOfBounds) {
        clearInterval(car.interval);
        car.element.remove();
        gameState.activeCars = gameState.activeCars.filter(c => c.element !== car.element);
    } else {
        car.element.style.left = `${newPosition}px`;
    }
}

function spawnCar() {
    if (gameState.activeCars.length >= gameConfig.maxActiveCars) return;
    
    const car = document.createElement('div');
    car.className = 'car';
    
    // Randomly determine car's spawn direction
    const spawnFromRight = Math.random() > 0.5;
    car.textContent = '🚗';
    car.style.transform = spawnFromRight ? 'scaleX(1)' : 'scaleX(-1)';
    
    // Adjust spawn position and timing
    const newCarTop = Math.random() * 250 + 120;
    const existingCars = document.querySelectorAll('.car');
    
    // Improved car spacing check
    let canSpawn = true;
    for (let existingCar of existingCars) {
        const existingTop = parseInt(existingCar.style.top);
        if (Math.abs(existingTop - newCarTop) < 80) {
            canSpawn = false;
            break;
        }
    }
    
    if (!canSpawn) return;
    
    car.style.top = `${newCarTop}px`;
    car.style.left = spawnFromRight ? '1000px' : '-60px';
    
    gameArea.appendChild(car);
    
    // Adjusted speed calculations
    const baseSpeed = 2 + Math.random() * 3;
    const speedMultiplier = 1 + (gameState.score / 100);
    const speed = baseSpeed * speedMultiplier;
    
    const carData = {
        element: car,
        interval: null
    };
    
    carData.interval = setInterval(() => {
        const currentLeft = parseInt(car.style.left);
        updateCarPosition(carData, currentLeft, speed, spawnFromRight);
        checkCollision(car);
    }, 16); // Changed to 16ms for smoother animation

    gameState.activeCars.push(carData);
}

function checkCollision(car) {
    // Get bounding rectangles for precise collision detection
    const chickenRect = chicken.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();
    
    // Check for rectangle intersection on all sides
    const collision = chickenRect.left < carRect.right &&
        chickenRect.right > carRect.left &&
        chickenRect.top < carRect.bottom &&
        chickenRect.bottom > carRect.top;
    
    if (collision) endGame();
}

function endGame() {
    gameState.isGameRunning = false;
    clearInterval(gameState.gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    // Show start button again
    startButton.classList.remove('hidden');
    
    // Update chicken appearance
    chicken.classList.remove('active');
    chicken.classList.add('crashed');
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('chickenGameHighScore', gameState.highScore);
        highScoreDisplay.textContent = `High Score: ${gameState.highScore}`;
    }
    
    // Show game over screen
    gameOverScreen.classList.remove('hidden');
    gameOverScreen.innerHTML = `
        <h2>Game Over!</h2>
        <p>Score: ${gameState.score}</p>
        <p>High Score: ${gameState.highScore}</p>
        <button onclick="startGame()">Play Again</button>
    `;
    
    // Clear all cars with fade out effect
    gameState.activeCars.forEach(car => {
        car.element.classList.add('fadeOut');
        setTimeout(() => {
            clearInterval(car.interval);
            car.element.remove();
        }, 500);
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
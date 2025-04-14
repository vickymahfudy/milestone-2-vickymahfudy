let gameInterval;
let score = 0;
let isGameRunning = false;

const chicken = document.getElementById('chicken');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');

function startGame() {
    if (isGameRunning) return;
    
    isGameRunning = true;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    
    // Reset chicken position to bottom safe zone
    chicken.style.bottom = '20px';
    chicken.style.left = '480px';
    
    // Start spawning cars with increased frequency
    gameInterval = setInterval(spawnCar, 100); // Changed from 200 to 100
    
    // Enable keyboard controls
    document.addEventListener('keydown', moveChicken);
}

function checkScore() {
    const currentBottom = parseInt(chicken.style.bottom) || 0;
    if (currentBottom >= 460) { // Matches the top safe zone
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        chicken.style.bottom = '20px'; // Reset to bottom safe zone
        chicken.style.left = '480px'; // Reset horizontal position
    }
}

// Remove the duplicate checkScore function at the bottom of the file
// Add this at the top with other variables
let activeCars = 0;

function spawnCar() {
    if (activeCars >= 20) return;
    
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

// Update endGame function to reset active cars counter
// Add at the top with other variables
const highScoreDisplay = document.getElementById('highScore');
let highScore = parseInt(localStorage.getItem('chickenGameHighScore')) || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Update the endGame function
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('chickenGameHighScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    
    alert(`Game Over! Your score: ${score}\nHigh Score: ${highScore}`);
    
    // Remove all cars and reset counter
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

function checkScore() {
    const currentBottom = parseInt(chicken.style.bottom) || 0;
    if (currentBottom >= 400) { // Adjusted to match the road crossing
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        chicken.style.bottom = '20px'; // Reset to bottom safe zone
        chicken.style.left = '480px'; // Reset horizontal position
    }
}

// Remove the duplicate endGame function at the bottom and keep only this one
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', moveChicken);
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('chickenGameHighScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
    
    alert(`Game Over! Your score: ${score}\nHigh Score: ${highScore}`);
    
    // Remove all cars and reset counter
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => car.remove());
    activeCars = 0;
}
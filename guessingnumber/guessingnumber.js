// Game Configuration
const gameConfig = {
    minNumber: 1,
    maxNumber: 100,
    initialAttempts: 10
};

// Game State
let targetNumber;
let attempts;
let guessedNumbers = [];
let highScore = localStorage.getItem('numberGameHighScore') || '-';

// DOM Elements
const elements = {
    attempts: document.getElementById('attempts'),
    highScore: document.getElementById('highScore'),
    guessedNumbers: document.getElementById('guessedNumbers'),
    message: document.getElementById('message'),
    guessInput: document.getElementById('guessInput'),
    submitGuess: document.getElementById('submitGuess'),
    gameContainer: document.getElementById('gameContainer'),
    gameOverScreen: document.getElementById('gameOverScreen')
};

function initializeGame() {
    targetNumber = Math.floor(Math.random() * gameConfig.maxNumber) + gameConfig.minNumber;
    attempts = gameConfig.initialAttempts;
    guessedNumbers = [];
    
    // Reset UI elements
    elements.attempts.textContent = attempts;
    elements.highScore.textContent = highScore;
    elements.guessedNumbers.textContent = '-';
    elements.message.textContent = '';
    elements.guessInput.value = '';
    
    // Reset game state and UI
    elements.guessInput.classList.remove('disabled');
    elements.submitGuess.classList.remove('disabled');
    elements.guessInput.disabled = false;
    elements.submitGuess.disabled = false;
    elements.gameOverScreen.classList.add('hidden');
    elements.gameContainer.classList.remove('game-over');
}

function handleWin() {
    elements.gameContainer.classList.add('winner');
    displayMessage(`Congratulations! You found the number in ${gameConfig.initialAttempts - attempts} attempts!`, 'green');
    toggleInput();
    updateHighScore(attempts);
    elements.gameOverScreen.classList.remove('hidden');
}

function handleGameOver() {
    elements.gameContainer.classList.add('game-over');
    displayMessage(`Game over! The number was ${targetNumber}.`, 'red');
    toggleInput();
    elements.gameOverScreen.classList.remove('hidden');
}

function toggleInput() {
    elements.guessInput.classList.add('disabled');
    elements.submitGuess.classList.add('disabled');
    elements.guessInput.disabled = true;
    elements.submitGuess.disabled = true;
}

// Game Logic Functions
function checkGuess() {
    const guess = parseInt(elements.guessInput.value);

    if (!isValidGuess(guess)) return;
    if (isDuplicateGuess(guess)) return;

    updateGameState(guess);

    if (isWinningGuess(guess)) {
        handleWin();
        return;
    }

    if (attempts === 0) {
        handleGameOver();
        return;
    }

    updateFeedback(guess);
    elements.guessInput.value = '';
}

// Updates game state and UI after each valid guess
// Tracks guessed numbers, remaining attempts, and updates display
function updateGameState(guess) {
    // Add new guess to history and update display
    guessedNumbers.push(guess);
    elements.guessedNumbers.textContent = guessedNumbers.join(', ');
    
    // Decrement and update remaining attempts
    attempts--;
    elements.attempts.textContent = attempts;
}

function isWinningGuess(guess) {
    return guess === targetNumber;
}

function updateFeedback(guess) {
    const comparison = Math.sign(guess - targetNumber);
    switch (comparison) {
        case -1:
            displayMessage(`Too low! Try a higher number.`, 'yellow');
            break;
        case 1:
            displayMessage(`Too high! Try a lower number.`, 'yellow');
            break;
    }
}

// Validates user input against game rules
// Ensures guess is a number within valid range
function isValidGuess(guess) {
    if (isNaN(guess) || guess < gameConfig.minNumber || guess > gameConfig.maxNumber) {
        displayMessage(`Please enter a valid number between ${gameConfig.minNumber} and ${gameConfig.maxNumber}`, 'red');
        return false;
    }
    return true;
}

// Prevents duplicate guesses to maintain fair gameplay
function isDuplicateGuess(guess) {
    if (guessedNumbers.includes(guess)) {
        displayMessage(`You already guessed that number. Try again.`, 'red');
        return true;
    }
    return false;
}

// Utility Functions
function displayMessage(text, color) {
    elements.message.textContent = text;
    elements.message.style.color = color;
}

// Updates high score if current performance is better
// High score is based on remaining attempts (higher is better)
function updateHighScore(attempts) {
    // Update only if it's the first high score or better than previous
    if (highScore === '-' || attempts > parseInt(highScore)) {
        highScore = attempts;
        localStorage.setItem('numberGameHighScore', highScore);
        elements.highScore.textContent = highScore;
    }
}

// Event Handlers
function resetGame() {
    initializeGame();
}

// Initialize game and set up event listeners
initializeGame();

elements.guessInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

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
    submitGuess: document.getElementById('submitGuess')
};

// Game Initialization
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
    elements.guessInput.disabled = false;
    elements.submitGuess.disabled = false;
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

function isValidGuess(guess) {
    if (isNaN(guess) || guess < gameConfig.minNumber || guess > gameConfig.maxNumber) {
        displayMessage(`Please enter a valid number between ${gameConfig.minNumber} and ${gameConfig.maxNumber}`, 'red');
        return false;
    }
    return true;
}

function isDuplicateGuess(guess) {
    if (guessedNumbers.includes(guess)) {
        displayMessage('You already guessed that number. Try again.', 'red');
        return true;
    }
    return false;
}

function updateGameState(guess) {
    guessedNumbers.push(guess);
    elements.guessedNumbers.textContent = guessedNumbers.join(', ');
    attempts--;
    elements.attempts.textContent = attempts;
}

function isWinningGuess(guess) {
    return guess === targetNumber;
}

function handleWin() {
    displayMessage(`Congratulations! You found the number in ${gameConfig.initialAttempts - attempts} attempts!`, 'green');
    toggleInput();
    updateHighScore(attempts);
}

function handleGameOver() {
    displayMessage(`Game over! The number was ${targetNumber}.`, 'red');
    toggleInput();
}

function updateFeedback(guess) {
    if (guess < targetNumber) {
        displayMessage('Too low! Try a higher number.', 'yellow');
    } else {
        displayMessage('Too high! Try a lower number.', 'yellow');
    }
}

// Utility Functions
function displayMessage(text, color) {
    elements.message.textContent = text;
    elements.message.style.color = color;
}

function toggleInput() {
    elements.guessInput.disabled = true;
    elements.submitGuess.disabled = true;
}

function updateHighScore(attempts) {
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

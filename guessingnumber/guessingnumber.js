let targetNumber;
let attempts;
let guessedNumbers = [];
let highScore = localStorage.getItem('numberGameHighScore') || '-';

function initializeGame() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 10;
    guessedNumbers = [];
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('guessedNumbers').textContent = '-';
    document.getElementById('message').textContent = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').disabled = false;
    document.getElementById('submitGuess').disabled = false;
}

function checkGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const messageElement = document.getElementById('message');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageElement.textContent = 'Please enter a valid number between 1 and 100';
        messageElement.style.color = 'red';
        return;
    }
    
    if (guessedNumbers.includes(guess)) {
        messageElement.textContent = 'You already guessed that number. Try again.';
        messageElement.style.color = 'red';
        return;
    }

    // Add the guessed number to the array
    guessedNumbers.push(guess);
    document.getElementById('guessedNumbers').textContent = guessedNumbers.join(', ');

    // Decrement the attempts
    attempts--;
    document.getElementById('attempts').textContent = attempts;

    if (guess === targetNumber) {
        messageElement.textContent = `Congratulations! You found the number in ${10-attempts} attempts!`;
        messageElement.style.color = 'green';
        toogleInput()
        updateHighScore(attempts);
        return;
    } else if (guess < targetNumber) {
        messageElement.textContent = 'Too low! Try a higher number.';
        messageElement.style.color = 'yellow';
    } else {
        messageElement.textContent = 'Too high! Try a lower number.';
        messageElement.style.color = 'yellow';
    }

    if (attempts === 0) {
        messageElement.textContent = `Game over! The number was ${targetNumber}.`;
        messageElement.style.color = 'red';
        toogleInput()
        return;
    }
    
    // Clear the input field for the next guess
    document.getElementById('guessInput').value = '';
}

function toogleInput() {
    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitGuess').disabled = true;
}

function updateHighScore(attempts) {
    if (highScore === '-' || attempts > parseInt(highScore)) {
        highScore = attempts;
        localStorage.setItem('numberGameHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

function resetGame() {
    initializeGame();
}

// Initialize the game when the page loads
initializeGame();

// Add enter key support
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

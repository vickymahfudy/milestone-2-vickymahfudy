// Game Configuration
const gameConfig = {
    choices: {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    },
    defaultHand: '❔',
    winConditions: {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    }
};

// Game State
let playerScore = 0;
let computerScore = 0;

// DOM Elements
const elements = {
    playerHand: document.getElementById('playerHand'),
    computerHand: document.getElementById('computerHand'),
    playerScore: document.getElementById('playerScore'),
    computerScore: document.getElementById('computerScore'),
    message: document.getElementById('message')
};

// Game Logic Functions
function computerPlay() {
    const options = Object.keys(gameConfig.choices);
    return options[Math.floor(Math.random() * options.length)];
}

function playRound(playerChoice) {
    const computerChoice = computerPlay();
    
    updateHandsDisplay(playerChoice, computerChoice);
    
    if (playerChoice === computerChoice) {
        displayResult("It's a tie!", 'yellow');
        return;
    }
    
    const playerWins = gameConfig.winConditions[playerChoice] === computerChoice;
    
    if (playerWins) {
        playerScore++;
        displayResult(
            `You win! ${gameConfig.choices[playerChoice]} beats ${gameConfig.choices[computerChoice]}`,
            'green'
        );
    } else {
        computerScore++;
        displayResult(
            `You lose! ${gameConfig.choices[computerChoice]} beats ${gameConfig.choices[playerChoice]}`,
            'red'
        );
    }
    
    updateScore();
}

// UI Update Functions
function updateHandsDisplay(playerChoice, computerChoice) {
    elements.playerHand.textContent = gameConfig.choices[playerChoice];
    elements.computerHand.textContent = gameConfig.choices[computerChoice];
}

function displayResult(message, color) {
    elements.message.textContent = message;
    elements.message.style.color = color;
}

function updateScore() {
    elements.playerScore.textContent = playerScore;
    elements.computerScore.textContent = computerScore;
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    elements.playerHand.textContent = gameConfig.defaultHand;
    elements.computerHand.textContent = gameConfig.defaultHand;
    elements.message.textContent = "Choose your move!";
}

// Event Listeners
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        playRound(button.dataset.choice);
    });
});

document.getElementById('resetGame').addEventListener('click', resetGame);
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
    
    const gameOutcome = determineOutcome(playerChoice, computerChoice);
    
    switch (gameOutcome) {
        case 'tie':
            displayResult(`It's a tie!`, 'yellow');
            break;
        case 'win':
            playerScore++;
            displayResult(
                `You win! ${gameConfig.choices[playerChoice]} beats ${gameConfig.choices[computerChoice]}`,
                'green'
            );
            break;
        case 'lose':
            computerScore++;
            displayResult(
                `You lose! ${gameConfig.choices[computerChoice]} beats ${gameConfig.choices[playerChoice]}`,
                'red'
            );
            break;
    }
    
    if (gameOutcome !== 'tie') {
        updateScore();
    }
}

function determineOutcome(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    return gameConfig.winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
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
    elements.message.textContent = `Choose your move!`;
}

// Event Listeners
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        playRound(button.dataset.choice);
    });
});

document.getElementById('resetGame').addEventListener('click', resetGame);
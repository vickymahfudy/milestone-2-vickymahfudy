// Game Configuration
const gameConfig = {
    // Emoji representations for each choice
    choices: {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    },
    defaultHand: '❔',
    // Defines what each choice can beat
    winConditions: {
        rock: 'scissors',    // Rock crushes scissors
        paper: 'rock',       // Paper covers rock
        scissors: 'paper'    // Scissors cuts paper
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
// Randomly selects computer's move from available choices
function computerPlay() {
    const options = Object.keys(gameConfig.choices);
    return options[Math.floor(Math.random() * options.length)];
}

// Processes a single round of the game
// Updates display, determines winner, and manages score
function playRound(playerChoice) {
    const computerChoice = computerPlay();
    updateHandsDisplay(playerChoice, computerChoice);
    
    const gameOutcome = determineOutcome(playerChoice, computerChoice);
    
    // Handle different game outcomes and update UI accordingly
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
    
    // Update score display if the round wasn't a tie
    if (gameOutcome !== 'tie') {
        updateScore();
    }
}

// Determines the outcome of a round based on player and computer choices
// Returns 'tie', 'win', or 'lose'
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
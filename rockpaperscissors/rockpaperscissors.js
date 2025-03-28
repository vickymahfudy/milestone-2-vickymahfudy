let playerScore = 0;
let computerScore = 0;

const choices = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

function computerPlay() {
    const options = ['rock', 'paper', 'scissors'];
    return options[Math.floor(Math.random() * options.length)];
}

function playRound(playerChoice) {
    const messageElement = document.getElementById('message');
    const computerChoice = computerPlay();
    
    // Update hands display
    document.getElementById('playerHand').textContent = choices[playerChoice];
    document.getElementById('computerHand').textContent = choices[computerChoice];
    
    // Determine winner
    if (playerChoice === computerChoice) {
        messageElement.textContent = "It's a tie!";
        messageElement.style.color = 'yellow';
        return;
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        playerScore++;
        updateScore();
        messageElement.textContent = 'You win! ' + choices[playerChoice] + ' beats ' + choices[computerChoice];
        messageElement.style.color = 'green';
    } else {
        computerScore++;
        updateScore();
        messageElement.textContent = 'You lose! ' + choices[computerChoice] + ' beats ' + choices[playerChoice];
        messageElement.style.color = 'red';
    }
}

function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScore();
    document.getElementById('playerHand').textContent = '❔';
    document.getElementById('computerHand').textContent = '❔';
    messageElement.textContent = "Choose your move!";
}

// Event Listeners
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        playRound(button.dataset.choice);
    });
});

document.getElementById('resetGame').addEventListener('click', resetGame);
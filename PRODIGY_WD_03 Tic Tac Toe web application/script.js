document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status-message');
    const restartButton = document.getElementById('restart-button');
    const tokenX = document.getElementById('token-x');
    const tokenO = document.getElementById('token-o');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const updateTurnIndicator = () => {
        if (currentPlayer === 'X') {
            tokenX.classList.add('active');
            tokenO.classList.remove('active');
        } else {
            tokenO.classList.add('active');
            tokenX.classList.remove('active');
        }
    };

    const displayMessage = (message, winner = null) => {
        if (winner) {
            const winnerSpan = `<span class="winner-${winner.toLowerCase()}">${winner}</span>`;
            statusDisplay.innerHTML = `${winnerSpan} WINS!`;
        } else {
            statusDisplay.textContent = message;
        }
        if (message === "" && !winner) { // Clear status if game is ongoing
             statusDisplay.innerHTML = "";
        }
    };

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());

        checkResult();
    };

    const highlightWinningCells = (condition, winner) => {
        condition.forEach(index => {
            cells[index].classList.add('win', winner.toLowerCase() + '-win');
        });
    };

    const checkResult = () => {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') continue;
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break;
            }
        }

        if (roundWon) {
            displayMessage("", currentPlayer); // Player X WINS! or Player O WINS!
            gameActive = false;
            if (winningLine) highlightWinningCells(winningLine, currentPlayer);
            tokenX.classList.remove('active'); // No active player after win
            tokenO.classList.remove('active');
            return;
        }

        if (!board.includes('')) {
            displayMessage('IT\'S A DRAW!');
            gameActive = false;
            tokenX.classList.remove('active');
            tokenO.classList.remove('active');
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        displayMessage(""); // Clear previous win/draw message if any
        updateTurnIndicator();
    };

    const restartGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win', 'x-win', 'o-win');
        });
        
        displayMessage(""); // Clear win/draw status
        updateTurnIndicator();
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initial setup
    updateTurnIndicator();
    displayMessage(""); // Start with no message, turn indicator shows current player
});
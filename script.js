// In your script.js file, find the winningConditions array and REPLACE it with this:

const winningConditions = [
    // The 'd' attributes now use percentages, which SVG handles beautifully.
    { combo: [0, 1, 2], lineCoords: 'M 5% 16.67% L 95% 16.67%' },  // Row 1
    { combo: [3, 4, 5], lineCoords: 'M 5% 50% L 95% 50%' },       // Row 2
    { combo: [6, 7, 8], lineCoords: 'M 5% 83.33% L 95% 83.33%' },  // Row 3
    { combo: [0, 3, 6], lineCoords: 'M 16.67% 5% L 16.67% 95%' },  // Col 1
    { combo: [1, 4, 7], lineCoords: 'M 50% 5% L 50% 95%' },       // Col 2
    { combo: [2, 5, 8], lineCoords: 'M 83.33% 5% L 83.33% 95%' },  // Col 3
    { combo: [0, 4, 8], lineCoords: 'M 5% 5% L 95% 95%' },       // Diag 1
    { combo: [2, 4, 6], lineCoords: 'M 95% 5% L 5% 95%' }        // Diag 2
];

// The rest of your script.js file remains exactly the same.
// Just ensure this one variable is updated.

// --- The rest of your existing script.js from the previous step ---
window.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const tilesContainer = document.querySelector('.container');
    const playerDisplay = document.querySelector('.display');
    const announcer = document.querySelector('.announcer');
    const resetButton = document.querySelector('#reset');
    const pvpButton = document.querySelector('#pvp');
    const pvcButton = document.querySelector('#pvc');
    const scoreXElement = document.querySelector('#scoreX');
    const scoreOElement = document.querySelector('#scoreO');
    const choiceModal = document.querySelector('#choiceModal');
    const chooseXButton = document.querySelector('#chooseX');
    const chooseOButton = document.querySelector('#chooseO');
    const winningLine = document.querySelector('#winning-line');
    const boardWrapper = document.querySelector('.board-wrapper');

    // --- Game State ---
    let board = ['', '', '', '', '', '', '', '', ''];
    let tiles = [];
    let currentPlayer = 'X';
    let isGameActive = true;
    let isAgainstComputer = false;
    let humanPlayer = 'X';
    let aiPlayer = 'O';
    let score = { X: 0, O: 0 };

    // THIS IS THE ONLY PART YOU NEED TO REPLACE
    const winningConditions = [
        { combo: [0, 1, 2], lineCoords: 'M 5% 16.67% L 95% 16.67%' },
        { combo: [3, 4, 5], lineCoords: 'M 5% 50% L 95% 50%' },
        { combo: [6, 7, 8], lineCoords: 'M 5% 83.33% L 95% 83.33%' },
        { combo: [0, 3, 6], lineCoords: 'M 16.67% 5% L 16.67% 95%' },
        { combo: [1, 4, 7], lineCoords: 'M 50% 5% L 50% 95%' },
        { combo: [2, 5, 8], lineCoords: 'M 83.33% 5% L 83.33% 95%' },
        { combo: [0, 4, 8], lineCoords: 'M 5% 5% L 95% 95%' },
        { combo: [2, 4, 6], lineCoords: 'M 95% 5% L 5% 95%' }
    ];

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const svgX = `<svg viewBox="0 0 52 52"><path d="M10 10 L 42 42 M 42 10 L 10 42" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>`;
    const svgO = `<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="18" stroke="currentColor" stroke-width="8" fill="none"/></svg>`;

    const handleResultValidation = () => {
        let roundWon = false;
        let winningCombo;

        for (const condition of winningConditions) {
            const [a, b, c] = condition.combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningCombo = condition;
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            drawWinningLine(winningCombo.lineCoords);
            setTimeout(() => announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON), 800);
            return;
        }

        if (!board.includes('')) announce(TIE);
    };

    const announce = (type) => {
        playerDisplay.classList.add('hide');
        announcer.classList.remove('hide');
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = `Player <span class="playerO">O</span> Won`;
                updateScore('O');
                break;
            case PLAYERX_WON:
                announcer.innerHTML = `Player <span class="playerX">X</span> Won`;
                updateScore('X');
                break;
            case TIE:
                announcer.innerText = 'Tie';
                break;
        }
    };

    const updateScore = (winner) => {
        if (winner) score[winner]++;
        scoreXElement.innerText = score.X;
        scoreOElement.innerText = score.O;
    };

    const drawWinningLine = (coords) => {
        winningLine.setAttribute('d', coords);
        const lineLength = winningLine.getTotalLength();
        winningLine.style.strokeDasharray = lineLength;
        winningLine.style.strokeDashoffset = lineLength;
        winningLine.getBoundingClientRect();
        winningLine.style.strokeDashoffset = 0;
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerHTML = `Player <span class="display-player player${currentPlayer}">${currentPlayer}</span>'s turn`;
    };

    const userAction = (tile, index) => {
        if (tile.innerHTML === '' && isGameActive) {
            tile.innerHTML = currentPlayer === 'X' ? svgX : svgO;
            tile.classList.add(`player${currentPlayer}`);
            board[index] = currentPlayer;
            handleResultValidation();
            if (isGameActive) {
                changePlayer();
                if (isAgainstComputer && currentPlayer === aiPlayer) {
                    boardWrapper.style.pointerEvents = 'none';
                    setTimeout(computerAction, 1000);
                }
            }
        }
    };
    
    const createBoard = () => {
        tilesContainer.innerHTML = '';
        tiles = [];
        for (let i = 0; i < 9; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.addEventListener('click', () => userAction(tile, i));
            tilesContainer.appendChild(tile);
            tiles.push(tile);
        }
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        playerDisplay.classList.remove('hide');

        winningLine.style.strokeDashoffset = '1000'; // Simply reset to a large value

        createBoard();

        currentPlayer = 'X';
        playerDisplay.innerHTML = `Player <span class="display-player playerX">X</span>'s turn`;

        if (isAgainstComputer && aiPlayer === 'X') {
            boardWrapper.style.pointerEvents = 'none';
            setTimeout(computerAction, 500);
        } else {
            boardWrapper.style.pointerEvents = 'auto';
        }
    };

    const computerAction = () => {
        if (!isGameActive) return;
        const bestMove = findBestMove(board, aiPlayer);
        const tile = tiles[bestMove.index];
        if (tile) userAction(tile, bestMove.index);
        boardWrapper.style.pointerEvents = 'auto';
    };

    const findBestMove = (board, player) => { 
        let bestVal = -Infinity;
        let bestMove = { index: -1 };
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = player;
                let moveVal = minimax(board, 0, false);
                board[i] = '';
                if (moveVal > bestVal) {
                    bestMove.index = i;
                    bestVal = moveVal;
                }
            }
        }
        return bestMove;
    }

    const minimax = (board, depth, isMaximizing) => {
        let score = evaluate(board);
        if (score === 10) return score - depth;
        if (score === -10) return score + depth;
        if (!board.includes('')) return 0;
        if (isMaximizing) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = aiPlayer;
                    best = Math.max(best, minimax(board, depth + 1, !isMaximizing));
                    board[i] = '';
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = humanPlayer;
                    best = Math.min(best, minimax(board, depth + 1, !isMaximizing));
                    board[i] = '';
                }
            }
            return best;
        }
    }

    const evaluate = (b) => {
        for (const condition of winningConditions) {
            const [a, b, c] = condition.combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === aiPlayer ? 10 : -10;
            }
        }
        return 0;
    }

    const setGameMode = (isPVC) => {
        isAgainstComputer = isPVC;
        pvpButton.classList.toggle('active', !isPVC);
        pvcButton.classList.toggle('active', isPVC);
        score = { X: 0, O: 0 };
        updateScore();
        if (isPVC) {
            choiceModal.classList.remove('hide');
        } else {
            resetBoard();
        }
    };

    resetButton.addEventListener('click', resetBoard);
    pvpButton.addEventListener('click', () => setGameMode(false));
    pvcButton.addEventListener('click', () => setGameMode(true));

    chooseXButton.addEventListener('click', () => {
        humanPlayer = 'X';
        aiPlayer = 'O';
        choiceModal.classList.add('hide');
        resetBoard();
    });

    chooseOButton.addEventListener('click', () => {
        humanPlayer = 'O';
        aiPlayer = 'X';
        choiceModal.classList.add('hide');
        resetBoard();
    });

    setGameMode(false);
    createBoard();
});
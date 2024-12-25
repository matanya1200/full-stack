// אלמנטים חשובים
const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const usernameDisplay = document.getElementById('usernameDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const backButton = document.getElementById('backButton');
const gameModeSelect = document.getElementById('gameMode');
const difficultySelect = document.getElementById('difficulty');
const difficultyContainer = document.getElementById('difficultyContainer');

// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// הצגת שם המשתמש
usernameDisplay.textContent = username;

// משתנים לניהול המשחק
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let score = 0;
let gameMode = 'twoPlayers'; // ברירת מחדל
let difficulty = 'easy';
let isComputerTurn = false;
let isGameActive = true;

// הצגת התוצאה
scoreDisplay.textContent = `Score: ${score}`;

// שינוי מצב המשחק
gameModeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value;
    resetBoard();
    difficultyContainer.style.display = gameMode === 'computer' ? 'block' : 'none';
    if (gameMode === 'computer' && difficulty === 'hard') {
        isComputerTurn = true;
        computerMove(); // המחשב מתחיל ברמת "קשה"
    }
});

// שינוי רמת הקושי
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;
    resetBoard();
    if (difficulty === 'hard') {
        isComputerTurn = true;
        computerMove(); // המחשב מתחיל ברמת "קשה"
    }
});

// מאזין לאירוע לחיצה על כפתור "חזרה"
backButton.addEventListener('click', () => {
    window.location.href = `../apps/applications.html?username=${username}`;
});

// מאזין לאירוע לחיצה על תאים
cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

// טיפול בלחיצה על תא
function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');
    if (board[index] !== '' || isComputerTurn || !isGameActive) return;

    makeMove(index, currentPlayer);

    const winningCombination = checkWin();
    if (winningCombination) return endGame(true, winningCombination);
    if (board.every(cell => cell !== '')) return endGame(false);

    if (gameMode === 'computer') {
        currentPlayer = 'O';
        isComputerTurn = true;
        computerMove();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// תנועת המחשב לפי רמת הקושי
function computerMove() {
    setTimeout(() => {
        let move;
        if (difficulty === 'easy') {
            move = getRandomMove();
        } else {
            move = getBestMove();
        }

        makeMove(move, 'O');

        const winningCombination = checkWin();
        if (winningCombination) return endGame(true, winningCombination);
        if (board.every(cell => cell !== '')) return endGame(false);

        currentPlayer = 'X';
        isComputerTurn = false;
    }, 500); // עיכוב קל ליצירת תחושת "מחשב חושב"
}

// בחירת תא רנדומלית
function getRandomMove() {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// בחירת תא "חכם" (בינוני/קשה)
function getBestMove() {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter(index => index !== null);
    const opponent = currentPlayer === 'X' ? 'O' : 'X'; // היריב

    // בדוק אם יש מהלך ניצחון למחשב
    for (let index of emptyCells) {
        board[index] = currentPlayer; // נסה מהלך ניצחון למחשב
        if (checkWin()) {
            board[index] = ''; // הסר את המהלך
            return index; // אם המהלך מנצח, חזור על האינדקס
        }
        board[index] = ''; // הסר את המהלך
    }

    // בדוק אם יש צורך לחסום את היריב
    for (let index of emptyCells) {
        board[index] = opponent; // נסה מהלך שיריב היה משחק
        if (checkWin()) {
            board[index] = ''; // הסר את המהלך
            return index; // אם המהלך היה גורם ליריב לנצח, חזור על האינדקס
        }
        board[index] = ''; // הסר את המהלך
    }

    return getRandomMove();
}

// ביצוע מהלך
function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add('taken');
}

// סיום המשחק
function endGame(isWin, winningCombination = null) {
    isGameActive = false;
    if (isWin) {
        if (currentPlayer === 'X') {
            score++;
            updateWins(); // עדכן את מספר הניצחונות
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // הוספת אנימציה לתאים המנצחים
        winningCombination.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('pulse'); // CSS לאנימציה
        });

        alert(`המנצח הוא: ${currentPlayer}`);
    } else {
        alert('המשחק נגמר בתיקו!');
    }

    // לחכות להקשת מקש
    document.addEventListener('keydown', resetBoardOnce, { once: true });
}

function resetBoardOnce() {
    resetBoard();
    isGameActive = true;
}

// פונקציה לבדוק אם יש מנצח
function checkWin() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const combination of winningCombinations) {
        if (combination.every(index => board[index] === currentPlayer)) {
            return combination;
        }
    }
    return null;
}

// פונקציה לאיפוס הלוח
function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'pulse');
    });
    currentPlayer = 'X';
    isComputerTurn = false;
}


function updateWins() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (!users[username]) {
        users[username] = { wins: 0 }; // אם אין נתונים, צור משתמש חדש
    }
    users[username].wins += 1; // הוסף ניצחון
    localStorage.setItem('users', JSON.stringify(users)); // שמור את הנתונים
}

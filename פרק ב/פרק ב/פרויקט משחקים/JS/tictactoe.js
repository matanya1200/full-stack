// ========= משתנים ראשיים ========= //

// אלמנטים חשובים בדף
const gameBoard = document.getElementById('gameBoard'); // אלמנט הלוח שבו מתקיים המשחק
const cells = document.querySelectorAll('.cell'); // כל התאים בלוח המשחק
const usernameDisplay = document.getElementById('usernameDisplay'); // אלמנט להצגת שם המשתמש
const scoreDisplay = document.getElementById('scoreDisplay'); // אלמנט להצגת הניקוד הנוכחי
const backButton = document.getElementById('backButton'); // כפתור לחזרה לעמוד היישומים
const gameModeSelect = document.getElementById('gameMode'); // תפריט לבחירת מצב המשחק (שני שחקנים/מול מחשב)
const difficultySelect = document.getElementById('difficulty'); // תפריט לבחירת רמת הקושי
const difficultyContainer = document.getElementById('difficultyContainer'); // קונטיינר שמכיל את אפשרויות רמות הקושי

// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search); // קריאת הפרמטרים מה-URL
const username = urlParams.get('username'); // שליפת שם המשתמש מתוך הפרמטרים

// הצגת שם המשתמש
usernameDisplay.textContent = username;

// משתנים לניהול המשחק
let currentPlayer = 'X'; // שחקן התור הנוכחי
let board = ['', '', '', '', '', '', '', '', '']; // מצב הלוח (ריק בהתחלה)
let score = 0; // משתנה לניקוד הנוכחי
let gameMode = 'twoPlayers'; // ברירת מחדל: מצב שני שחקנים
let difficulty = 'easy'; // ברירת מחדל: רמת קושי קלה
let isComputerTurn = false; // דגל לציון אם זה תור המחשב
let isGameActive = true; // דגל לציון אם המשחק פעיל


// ========= ניהול תצוגת העמוד ========= //

// הצגת התוצאה
scoreDisplay.textContent = `Score: ${score}`;

// שינוי מצב המשחק
gameModeSelect.addEventListener('change', (e) => {
    gameMode = e.target.value; // עדכון מצב המשחק לפי הבחירה
    resetBoard(); // איפוס הלוח
    difficultyContainer.style.display = gameMode === 'computer' ? 'block' : 'none'; // הצגת אפשרויות רמות קושי אם המצב הוא נגד מחשב
    if (gameMode === 'computer' && difficulty === 'hard') {
        isComputerTurn = true; // המחשב מתחיל במצב קשה
        computerMove();
    }
});

// שינוי רמת הקושי
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value; // עדכון רמת הקושי לפי הבחירה
    resetBoard(); // איפוס הלוח
    if (difficulty === 'hard') {
        isComputerTurn = true; // המחשב מתחיל במצב קשה
        computerMove();
    }
});

// מאזין לאירוע לחיצה על כפתור "חזרה"
backButton.addEventListener('click', () => {
    window.location.href = `../HTML/applications.html?username=${username}`;
});

// מאזין לאירוע לחיצה על תאים
cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell)); // חיבור כל תא ללחיצה
});


// ========= פונקציות עיקריות ========= //

// טיפול בלחיצה על תא
function handleCellClick(cell) {
    const index = cell.getAttribute('data-index'); // קבלת האינדקס של התא
    if (board[index] !== '' || isComputerTurn || !isGameActive) return; // בדיקה אם התא תפוס, תור מחשב או משחק לא פעיל

    makeMove(index, currentPlayer); // ביצוע מהלך של השחקן הנוכחי

    const winningCombination = checkWin(); // בדיקת ניצחון
    if (winningCombination) return endGame(true, winningCombination); // סיום משחק אם יש ניצחון
    if (board.every(cell => cell !== '')) return endGame(false); // סיום משחק אם יש תיקו

    if (gameMode === 'computer') {
        currentPlayer = 'O'; // מעבר לתור המחשב
        isComputerTurn = true;
        computerMove();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // מעבר לשחקן הבא
    }
}

// תנועת המחשב לפי רמת הקושי
function computerMove() {
    setTimeout(() => {
        let move = (difficulty === 'easy') ? getRandomMove() : getBestMove(); // בחירת מהלך לפי רמת קושי
        makeMove(move, 'O'); // ביצוע המהלך

        const winningCombination = checkWin(); // בדיקת ניצחון
        if (winningCombination) return endGame(true, winningCombination); // סיום משחק אם יש ניצחון
        if (board.every(cell => cell !== '')) return endGame(false); // סיום משחק אם יש תיקו

        currentPlayer = 'X'; // חזרה לתור השחקן
        isComputerTurn = false;
    }, 500); // עיכוב ליצירת תחושת "מחשב חושב"
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

//עדכון נצחונות
function updateWins() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (!users[username]) {
        users[username] = { wins: 0 , tictactoePlayed: 0  }; // אם אין נתונים, צור משתמש חדש
    }
    users[username].wins += 1; // הוסף ניצחון
    users[username].tictactoePlayed = (users[username].tictactoePlayed || 0) + 1;// ספירת משחקים
    localStorage.setItem('users', JSON.stringify(users)); // שמור את הנתונים
}

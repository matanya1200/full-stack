// ========= משתנים ראשיים ========= //

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('scoreDisplay');
const backButton = document.getElementById('backButton');

// קריאת שם המשתמש מה-Cookies
const username = document.cookie.split('; ').find(row => row.startsWith('loggedInUser=')).split('=')[1];

const usernameDisplay = document.getElementById('usernameDisplay'); // אלמנט להצגת שם המשתמש
usernameDisplay.textContent = username;


// משתני משחק
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let scoreCount = 0;
let isGameRunning = false;
const boardSize = 20;

// ========= פונקציות עיקריות ========= //

// אתחול המשחק
function initGame() {
    createBoard();
    drawSnake();
    drawFood();
    updateScore();
    isGameRunning = true;
    document.addEventListener('keydown', changeDirection);
    gameLoop();
}

// יצירת לוח המשחק
function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
}

// ציור הנחש
function drawSnake() {
    snake.forEach(segment => {
        const cell = getCell(segment.x, segment.y);
        cell.classList.add('snake');
    });
}

// הסרת הנחש מהלוח
function clearSnake() {
    document.querySelectorAll('.snake').forEach(cell => cell.classList.remove('snake'));
}

// ציור האוכל
function drawFood() {
    const cell = getCell(food.x, food.y);
    cell.classList.add('food');
}

// קבלת תא בלוח
function getCell(x, y) {
    const index = y * boardSize + x;
    return gameBoard.children[index];
}

// שינוי כיוון
function changeDirection(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
    }
}

// לולאת המשחק
function gameLoop() {
    if (!isGameRunning) return;

    setTimeout(() => {
        clearSnake();
        moveSnake();
        if (checkCollision()) {
            alert('המשחק נגמר! ניקוד: ' + score);
            resetGame();
            return;
        }
        if (checkFood()) {
            growSnake();
            deleteFood();
            generateFood();
            updateScore();
        }
        drawSnake();
        drawFood();
        gameLoop();
    }, 120);
}

// תנועת הנחש
function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

// בדיקת התנגשות
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= boardSize || head.y >= boardSize) return true;
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// בדיקת אכילת אוכל
function checkFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// צמיחת הנחש
function growSnake() {
    const tail = snake[snake.length - 1];
    snake.push({ ...tail });
    score++;
    scoreCount++;
    
    if(scoreCount == 10){
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[username].wins += 1; // הגדלת מספר הניצחונות
        localStorage.setItem('users', JSON.stringify(users)); // שמירת הנתונים המעודכנים ב-localStorage
        scoreCount = 0;
    }
}

// יצירת אוכל חדש
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * boardSize),
            y: Math.floor(Math.random() * boardSize)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function deleteFood(){
    const foodCells = document.querySelectorAll('.food');
    
    foodCells.forEach(cell => {
        cell.classList.remove('food'); // הסרת המחלקה
    });
}

// עדכון ניקוד
function updateScore() {
    scoreDisplay.textContent = `ניקוד: ${score}`;
}

// איפוס המשחק
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    updateWins();
    score = 0;
    scoreCount = 0;
    isGameRunning = false;
    createBoard();
    drawSnake();
    drawFood();
    updateScore();
    location.reload();
}

function updateWins(){
    const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת נתוני המשתמשים מ-localStorage
    if (!users[username]) {
        // אם המשתמש לא קיים ב-localStorage, יצירת רשומה חדשה עבורו
        users[username] = { 
            wins: 0,              // אתחול מספר הניצחונות
            snakePlayed: 0   // אתחול מספר המשחקים ששוחקו
        };
    }
    let scoreBefore = users[username].snakePlayed || 0;
    if(score > scoreBefore){
        users[username].snakePlayed = score; // הגדלת מונה המשחקים
    }
    else{
        users[username].snakePlayed = scoreBefore;
    }
    localStorage.setItem('users', JSON.stringify(users)); // שמירת הנתונים המעודכנים ב-localStorage
}

// ========= התחל את המשחק ========= //
backButton.addEventListener('click', () => {
    window.location.href = '../HTML/applications.html';
});

initGame();

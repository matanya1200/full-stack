// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// הגדרות בסיסיות
let score = 0; // משתנה שמחזיק את הניקוד הנוכחי

// מציאת האלמנטים בדף
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('scoreDisplay');

// פונקציה שמעדכנת את הניקוד
function updateScore() {
    score++;
    scoreDisplay.textContent = `ניקוד: ${score}`;
    moveBallRandomly(); // להזיז את הכדור לאחר כל קליק
    updateWins();
}

// פונקציה שמזיזה את הכדור למיקום אקראי
function moveBallRandomly() {
    const gameContainer = document.getElementById('gameContainer');
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;

    const ballSize = ball.offsetWidth; 
    const randomX = Math.floor(Math.random() * (containerWidth - ballSize));
    const randomY = Math.floor(Math.random() * (containerHeight - ballSize));

    ball.style.left = `${randomX}px`;
    ball.style.top = `${randomY}px`;
}


// הוספת מאזין אירועים לכדור
ball.addEventListener('click', updateScore);

function updateWins() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (!users[username]) {
        users[username] = { wins: 0 }; // אם אין נתונים, צור משתמש חדש
    }
    users[username].wins += 1; // הוסף ניצחון
    localStorage.setItem('users', JSON.stringify(users)); // שמור את הנתונים
}

// מאזין לאירוע לחיצה על כפתור "חזרה"
backButton.addEventListener('click', () => {
    window.location.href = `../apps/applications.html?username=${username}`;
});

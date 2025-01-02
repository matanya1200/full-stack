// ========= משתנים ראשיים ========= //

// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search); // שליפת הפרמטרים מה-URL
const username = urlParams.get('username'); // קריאת הערך של הפרמטר "username"

// הגדרות בסיסיות
let score = 0; // משתנה שמחזיק את הניקוד הנוכחי
let difficulty = 'easy'; // ברירת מחדל: קל
let ballInterval = null; // מזהה ה-Interval של תנועת הכדור

// מציאת האלמנטים בדף
const ball = document.getElementById('ball'); // איתור האלמנט שמייצג את הכדור
const scoreDisplay = document.getElementById('scoreDisplay'); // איתור אלמנט להצגת הניקוד
const difficultySelect = document.getElementById('difficultySelect');// איתור אלמנט רמת קושי

// עדכון רמת הקושי
difficultySelect.addEventListener('change', (e) => {
    difficulty = e.target.value;

    // עצירת תנועת הכדור אם ישנה
    if (ballInterval) {
        clearInterval(ballInterval);
        ballInterval = null;
    }

    // אם רמת הקושי קשה, התחל תנועה רנדומלית
    if (difficulty === 'hard') {
        ballInterval = setInterval(() => moveBallRandomly(), 1000); // עדכון מיקום כל שנייה
    }
});

// הוספת מאזין אירועים לכדור
ball.addEventListener('click', updateScore);

// מאזין לאירוע לחיצה על כפתור "חזרה"
backButton.addEventListener('click', () => {
    // חזרה לעמוד היישומים עם שם המשתמש ב-URL
    window.location.href = `../HTML/applications.html?username=${username}`;
});

// ========= פונקציות עיקריות ========= //

// פונקציה שמעדכנת את הניקוד
function updateScore() {
    score++; // הגדלת הניקוד ב-1 בכל לחיצה על הכדור
    scoreDisplay.textContent = `ניקוד: ${score}`; // עדכון התצוגה עם הניקוד החדש
    moveBallRandomly(); // הזזת הכדור למיקום אקראי חדש
    updateWins(); // עדכון הנתונים ב-localStorage
}

// פונקציה שמזיזה את הכדור למיקום אקראי
function moveBallRandomly() {
    const gameContainer = document.getElementById('gameContainer'); // איתור מיכל המשחק
    const containerWidth = gameContainer.offsetWidth; // רוחב המיכל
    const containerHeight = gameContainer.offsetHeight; // גובה המיכל

    const ballSize = ball.offsetWidth; // גודל הכדור
    const randomX = Math.floor(Math.random() * (containerWidth - ballSize)); // חישוב מיקום X אקראי
    const randomY = Math.floor(Math.random() * (containerHeight - ballSize)); // חישוב מיקום Y אקראי

    ball.style.left = `${randomX}px`; // שינוי מיקום אופקי של הכדור
    ball.style.top = `${randomY}px`; // שינוי מיקום אנכי של הכדור
}

// פונקציה שמעדכנת את נתוני המשתמש ב-localStorage
function updateWins() {
    const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת נתוני המשתמשים מ-localStorage
    if (!users[username]) {
        // אם המשתמש לא קיים ב-localStorage, יצירת רשומה חדשה עבורו
        users[username] = { 
            wins: 0,              // אתחול מספר הניצחונות
            movingBallPlayed: 0   // אתחול מספר המשחקים ששוחקו
        };
    }
    users[username].wins += 1; // הגדלת מספר הניצחונות
    users[username].movingBallPlayed = (users[username].movingBallPlayed || 0) + 1; // הגדלת מונה המשחקים
    localStorage.setItem('users', JSON.stringify(users)); // שמירת הנתונים המעודכנים ב-localStorage
}

// התחלה ראשונית
moveBallRandomly();
// ========= משתנים ראשיים ========= //

// קריאת שם המשתמש מה-URL
// ========= פונקציה לקריאת Cookies ========= //
const username = document.cookie.split('; ').find(row => row.startsWith('loggedInUser=')).split('=')[1];

const usernameDisplay = document.getElementById('usernameDisplay'); // אלמנט להצגת שם המשתמש
usernameDisplay.textContent = username;

// הגדרות בסיסיות
let score = 0; // משתנה שמחזיק את הניקוד הנוכחי
let wins = 0; // משתנה שמייצג את הניקוד הכללי
let difficulty = 'easy'; // ברירת מחדל: קל
let ballInterval = null; // מזהה ה-Interval של תנועת הכדור
let timer = 120; // זמן המשחק (3 דקות)

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


// מאזין לאירוע לחיצה על כפתור "חזרה"
backButton.addEventListener('click', () => {
    // חזרה לעמוד היישומים עם שם המשתמש ב-URL
    window.location.href = `applications.html`;
});

// ========= פונקציות עיקריות ========= //

// פונקציה שמעדכנת את הניקוד
function updateScore() {
    score++; // הגדלת הניקוד ב-1 בכל לחיצה על הכדור
    scoreDisplay.textContent = `ניקוד: ${score}`; // עדכון התצוגה עם הניקוד החדש

    // עדכון הניקוד הכללי (wins) בהתאם לרמת הקושי
    if (difficulty === 'easy' && score % 10 === 0) {
        wins++;
        updateWins();
    } else if (difficulty === 'hard') {
        wins++;
        updateWins();
    }

    moveBallRandomly(); // הזזת הכדור למיקום אקראי חדש
}

function updateWins() {
    const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת נתוני המשתמשים מ-localStorage
    if (!users[username]) {
        // אם המשתמש לא קיים ב-localStorage, יצירת רשומה חדשה עבורו
        users[username] = { wins: 0, movingBallPlayed: 0 };
    }
    users[username].wins = (users[username].wins || 0) + wins; // הגדלת מספר הניצחונות
    let scoreBefore = users[username].movingBallPlayed || 0;
    if(score > scoreBefore){
        users[username].movingBallPlayed = score; // הגדלת מונה המשחקים
    }
    else{
        users[username].movingBallPlayed = scoreBefore; // הגדלת מונה המשחקים
    }
    localStorage.setItem('users', JSON.stringify(users)); // שמירת הנתונים המעודכנים ב-localStorage
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

// פונקציה לניהול טיימר המשחק
function startTimer() {
    const timerDisplay = document.createElement('p'); // יצירת אלמנט להצגת הטיימר
    timerDisplay.id = 'timerDisplay';
    timerDisplay.textContent = `זמן נותר: ${timer} שניות`;
    document.body.insertBefore(timerDisplay, document.body.firstChild);

    const interval = setInterval(() => {
        timer--;
        timerDisplay.textContent = `זמן נותר: ${timer} שניות`;

        if (timer <= 0) {
            clearInterval(interval); // עצירת הטיימר
            endGame(); // סיום המשחק
        }
    }, 1000);
}

function endGame() {
    alert(`המשחק נגמר! ניקוד סופי: ${score}. ניקוד כללי: ${wins}`);
    window.location.href = 'applications.html'; // חזרה לעמוד היישומים
}

// התחלה ראשונית
ball.addEventListener('click', updateScore);
moveBallRandomly();
startTimer();

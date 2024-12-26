// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search); // שליפת הפרמטרים מה-URL
const username = urlParams.get('username'); // קריאת הערך של הפרמטר "username"

// הצגת שם המשתמש
const usernameDisplay = document.getElementById('usernameDisplay'); // איתור האלמנט להצגת שם המשתמש
usernameDisplay.textContent = username; // הצגת שם המשתמש בעמוד

// הצגת מידע על ניקוד 
const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת הנתונים מ-localStorage או אתחול כאובייקט ריק
const user = users[username]; // שליפת המידע של המשתמש לפי שם המשתמש

// הגדרת נתונים עבור המשחקים
const gameStats = [
    { id: "tictactoe", name: "איקס עיגול" }, // מידע על המשחק הראשון
    { id: "movingBall", name: "כדור זז" },   // מידע על המשחק השני
];

// הצגת ניקוד וניצחונות
if (user) {
    // בדיקה אם למשתמש יש ערך של "wins" להצגת הניקוד הנוכחי
    if (user.wins) {
        const scoreParagraph = document.createElement('p'); // יצירת פסקה חדשה להצגת הניקוד
        scoreParagraph.textContent = `הניקוד שלך: ${user.wins}`; // הגדרת טקסט הפסקה
        document.querySelector('header').appendChild(scoreParagraph); // הוספת הפסקה לכותרת העמוד
    }
} else {
    // במקרה שאין נתונים עבור המשתמש
    const noDataParagraph = document.createElement('p'); // יצירת פסקה חדשה
    noDataParagraph.textContent = 'אין נתונים זמינים עבור משתמש זה.'; // הגדרת הודעת ברירת המחדל
    document.querySelector('header').appendChild(noDataParagraph); // הוספת הפסקה לכותרת העמוד
}

// הצגת מידע על כל משחק
if (user) {
    gameStats.forEach(game => {
        const gamesPlayed = user[`${game.id}Played`] || 0; // קריאת מספר הפעמים ששוחק המשחק, או אתחול ל-0 אם אין ערך
        const gameCard = document.querySelector(`[data-game="${game.id}"]`); // איתור כרטיס המשחק לפי המזהה
        const statsParagraph = document.createElement('p'); // יצירת פסקה חדשה להצגת סטטיסטיקות המשחק
        statsParagraph.textContent = `שם המשחק: ${game.name}, משחקים ששוחקו: ${gamesPlayed}`; // הגדרת הטקסט עם הנתונים
        gameCard.appendChild(statsParagraph); // הוספת הפסקה לכרטיס המשחק
    });
}

// התנתקות
document.getElementById('logoutButton').addEventListener('click', () => {
    // הסרת עוגיה
    document.cookie = "loggedInUser=; max-age=0"; // איפוס העוגיה שמכילה את המידע על המשתמש המחובר
    
    // חזרה לעמוד הכניסה
    window.location.href = "../HTML/login.html"; // מעבר לעמוד הכניסה
});

// הוספת אירועים לכפתורי המשחקים
const gameButtons = document.querySelectorAll('.play-game'); // איתור כל הכפתורים להפעלת המשחקים
gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameUrl = button.getAttribute('data-game'); // קריאת הקישור של המשחק מהמאפיין "data-game"
        // הוספת שם המשתמש ל-URL
        window.location.href = `${gameUrl}?username=${encodeURIComponent(username)}`; // מעבר לכתובת החדשה עם שם המשתמש
    });
});
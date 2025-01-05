// ========= פונקציה לקריאת Cookies ========= //
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

// ========= משתנים ראשיים ========= //

// קריאת שם המשתמש מתוך ה-Cookie
const username = getCookie('loggedInUser');

if (!username) {
    alert('לא זוהית כמשתמש מחובר. יש לבצע כניסה.');
    window.location.href = 'login.html'; // הפניה לעמוד הכניסה אם אין שם משתמש
}

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
        statsParagraph.textContent = `שם המשחק: ${game.name}, ניקוד כולל: ${gamesPlayed}`; // הגדרת הטקסט עם הנתונים
        gameCard.appendChild(statsParagraph); // הוספת הפסקה לכרטיס המשחק
    });
}

// התנתקות
document.getElementById('logoutButton').addEventListener('click', () => {
    // הסרת עוגיה
    document.cookie = "loggedInUser=; max-age=0"; // איפוס העוגיה שמכילה את המידע על המשתמש המחובר
    
    // חזרה לעמוד הכניסה
    window.location.href = "login.html"; // מעבר לעמוד הכניסה
});

// הוספת אירועים לכפתורי המשחקים
const gameButtons = document.querySelectorAll('.play-game'); // איתור כל הכפתורים להפעלת המשחקים
gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameUrl = button.getAttribute('data-game'); // קריאת הקישור של המשחק מהמאפיין "data-game"
        // הוספת שם המשתמש ל-URL
        window.location.href = `${gameUrl}`; // מעבר לכתובת החדשה עם שם המשתמש
    });
});

// יצירת טבלה של משתמשים רשומים
const usersTable = document.getElementById('usersTable').querySelector('tbody');

// שליפת כל המשתמשים מ-localStorage
Object.entries(users).forEach(([key, userData]) => {
    const row = document.createElement('tr');

    // עמודת שם המשתמש
    const usernameCell = document.createElement('td');
    usernameCell.textContent = key; // שם המשתמש
    row.appendChild(usernameCell);

    // עמודת מספר ניצחונות
    const winsCell = document.createElement('td');
    winsCell.textContent = userData.wins || 0; // מספר הניצחונות או 0 אם לא קיים
    row.appendChild(winsCell);

    // עמודת תאריך כניסה אחרון
    const lastLoginCell = document.createElement('td');
    lastLoginCell.textContent = userData.lastLogin || 'לא ידוע'; // תאריך כניסה אחרון או ברירת מחדל
    row.appendChild(lastLoginCell);

    // הוספת השורה לטבלה
    usersTable.appendChild(row);
});

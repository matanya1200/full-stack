// קריאת שם המשתמש מה-URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// הצגת שם המשתמש
const usernameDisplay = document.getElementById('usernameDisplay');
usernameDisplay.textContent = username;

// הצגת מידע על ניקוד (דוגמה)
const users = JSON.parse(localStorage.getItem('users')) || {};
const user = users[username];

// הצגת ניקוד וניצחונות
if (user) {
    // הצגת הניקוד הנוכחי
    if (user.wins) {
        const scoreParagraph = document.createElement('p');
        scoreParagraph.textContent = `הניקוד שלך: ${user.wins}`;
        document.querySelector('header').appendChild(scoreParagraph);
    }
} else {
    const noDataParagraph = document.createElement('p');
    noDataParagraph.textContent = 'אין נתונים זמינים עבור משתמש זה.';
    document.querySelector('header').appendChild(noDataParagraph);
}

// התנתקות
document.getElementById('logoutButton').addEventListener('click', () => {
    // הסרת עוגיה
    document.cookie = "loggedInUser=; max-age=0";
    
    // חזרה לעמוד הכניסה
    window.location.href = "../login/login.html";
});

// הוספת אירועים לכפתורי המשחקים
const gameButtons = document.querySelectorAll('.play-game');
gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameUrl = button.getAttribute('data-game');
        // הוספת שם המשתמש ל-URL
        window.location.href = `${gameUrl}?username=${encodeURIComponent(username)}`;
    });
});
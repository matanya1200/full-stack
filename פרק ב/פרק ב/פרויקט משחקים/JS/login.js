// ========= משתנים ראשיים ========= //

// אלמנטים חשובים בדף
const loginForm = document.getElementById('loginForm'); // טופס כניסה
const registerForm = document.getElementById('registerForm'); // טופס רישום
const showLoginButton = document.getElementById('showLogin'); // כפתור להצגת טופס כניסה
const showRegisterButton = document.getElementById('showRegister'); // כפתור להצגת טופס רישום


// ========= ניהול תצוגת טפסים ========= //

// הצגת טופס כניסה
showLoginButton.addEventListener('click', () => {
    loginForm.classList.remove('hidden'); // הופך את טופס הכניסה לגלוי
    registerForm.classList.add('hidden'); // מסתיר את טופס הרישום
});

// הצגת טופס רישום
showRegisterButton.addEventListener('click', () => {
    registerForm.classList.remove('hidden'); // הופך את טופס הרישום לגלוי
    loginForm.classList.add('hidden'); // מסתיר את טופס הכניסה
});


// ========= ניהול טופס רישום ========= //
// טיפול בטופס רישום
registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // מניעת ריענון דף ברירת המחדל בעת שליחת הטופס
    const username = document.getElementById('username').value; // קריאת שם משתמש
    const password = document.getElementById('password').value; // קריאת סיסמה
    const confirmPassword = document.getElementById('confirm-password').value; // קריאת אימות סיסמה

    if (password !== confirmPassword) {
        alert('הסיסמאות אינן תואמות!'); // הצגת הודעת שגיאה
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת רשימת המשתמשים מ-localStorage
    if (users[username]) {
        alert('שם משתמש כבר קיים!'); // הודעה אם המשתמש כבר רשום
        return;
    }

    // הוספת המשתמש החדש ל-localStorage
    users[username] = { 
        password,            // שמירת סיסמה
        attempts: 0,         // אתחול ניסיונות כניסה שגויים
        wins: 0 ,             // אתחול מספר ניצחונות
        block: false,         // חסימת משתמש
    };
    localStorage.setItem('users', JSON.stringify(users)); // שמירת רשימת המשתמשים ב-localStorage
    alert('נרשמת בהצלחה!'); // הודעת הצלחה
    registerForm.reset(); // איפוס הטופס
    registerForm.classList.add('hidden'); // הסתרת טופס הרישום
    loginForm.classList.remove('hidden'); // הצגת טופס הכניסה
});

// ========= ניהול טופס כניסה ========= //
// טיפול בטופס כניסה
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // מניעת ריענון דף ברירת המחדל בעת שליחת הטופס
    const username = document.getElementById('loginUsername').value; // קריאת שם משתמש
    const password = document.getElementById('loginPassword').value; // קריאת סיסמה

    const users = JSON.parse(localStorage.getItem('users')) || {}; // שליפת רשימת המשתמשים מ-localStorage
    const user = users[username]; // חיפוש המשתמש לפי שם

    // בדיקה אם המשתמש קיים
    if (!user) {
        alert('שם משתמש לא קיים!'); // הצגת הודעת שגיאה אם המשתמש לא קיים
        return;
    }

    // בדיקה אם המשתמש חסום
    if (user.block) {
        alert('משתמש זה נחסם עקב מספר ניסיונות שגויים!');
        return;
    }

    // בדיקה אם הסיסמה תואמת
    if (user.password !== password) {
        user.attempts = (user.attempts || 0) + 1; // הגדלת מונה ניסיונות כניסה שגויים
        if (user.attempts >= 3) {
            user.block = true; // חסימת המשתמש
            alert('חשבון נחסם עקב 3 ניסיונות שגויים!'); // הודעה על חסימה
        } else {
            alert('סיסמה שגויה! נותרו ' + (3 - user.attempts) + ' ניסיונות.'); // הודעה עם מספר ניסיונות שנותרו
        }
        localStorage.setItem('users', JSON.stringify(users)); // עדכון הנתונים ב-localStorage
        return;
    }

    // כניסה מוצלחת
    alert('ברוך הבא, ' + username + '!'); // הודעת הצלחה
    document.cookie = `loggedInUser=${username}; max-age=7200`; // יצירת עוגיה עם שם המשתמש ותוקף לשעתיים

    loginForm.reset(); // איפוס טופס הכניסה

    // עדכון זמן הכניסה האחרון
    const currentTime = new Date().toLocaleString(); // זמן הכניסה הנוכחי בפורמט קריא
    user.lastLogin = currentTime; // עדכון מועד הכניסה האחרון למשתמש
    user.attempts = 0; // איפוס מונה ניסיונות שגויים
    localStorage.setItem('users', JSON.stringify(users)); // שמירת הנתונים המעודכנים ב-localStorage

    // הפניה לעמוד היישומים עם שם המשתמש ב-URL
    window.location.href = `applications.html`;
});



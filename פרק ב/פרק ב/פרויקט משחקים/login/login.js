// אלמנטים חשובים בדף
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showLoginButton = document.getElementById('showLogin');
const showRegisterButton = document.getElementById('showRegister');

// הצגת טופס כניסה
showLoginButton.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

// הצגת טופס רישום
showRegisterButton.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// טיפול בטופס רישום
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('הסיסמאות אינן תואמות!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('שם משתמש כבר קיים!');
        return;
    }

    users[username] = { password, attempts: 0 };
    localStorage.setItem('users', JSON.stringify(users));
    alert('נרשמת בהצלחה!');
    registerForm.reset();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// טיפול בטופס כניסה
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[username];

    if (!user) {
        alert('שם משתמש לא קיים!');
        return;
    }

    if (user.password !== password) {
        user.attempts = (user.attempts || 0) + 1;
        if (user.attempts >= 3) {
            alert('חשבון נחסם עקב 3 ניסיונות שגויים!');
        } else {
            alert('סיסמה שגויה! נותרו ' + (3 - user.attempts) + ' ניסיונות.');
        }
        localStorage.setItem('users', JSON.stringify(users));
        return;
    }

    alert('ברוך הבא, ' + username + '!');
    document.cookie = `loggedInUser=${username}; max-age=3600`; // יצירת עוגיה עם תפוגה לשעה
    loginForm.reset();

    // הפניה לעמוד היישומים עם שם המשתמש ב-URL
    window.location.href = `../apps/applications.html?username=${username}`;
});

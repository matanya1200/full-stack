// פרטי משתמש מורשה
const authorizedUser = {
    username: "admin", // שם משתמש
    password: "1234"   // סיסמה
};

// הצגת עמוד הניהול לאחר התחברות
document.getElementById("login-btn").addEventListener("click", () => {
    const username = document.getElementById("user_name").value;
    const password = document.getElementById("password").value;

    if (username === authorizedUser.username && password === authorizedUser.password) {
        document.getElementById("admin-access").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";
    } else {
        alert("שם המשתמש או הסיסמה שגויים.");
    }
});

// הוספת ספר חדש למלאי ולגלריה
document.getElementById("submit-book-btn").addEventListener("click", () => {
    // קבלת נתוני הטופס
    const serial = document.getElementById("serial").value;
    const bookName = document.getElementById("book-name").value;
    const seriesName = document.getElementById("series-name").value;
    const authorName = document.getElementById("author-name").value;
    const imageUrl = document.getElementById("image-url").value;

    // בדיקה אם כל השדות מלאים
    if (!serial || !bookName || !seriesName || !authorName || !imageUrl) {
        alert("נא למלא את כל השדות.");
        return;
    }

    // הוספת שורה לטבלה
    const tableBody = document.querySelector("table tbody");
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${serial}</td>
        <td>${bookName}</td>
        <td>${seriesName}</td>
        <td>${authorName}</td>
    `;
    tableBody.appendChild(newRow);

    // הוספת תמונה לגלריה
    const gallery = document.querySelector(".gallery div");
    const newImageContainer = document.createElement("div");
    newImageContainer.classList.add("image-container");
    newImageContainer.innerHTML = `
        <img src="${imageUrl}" alt="${bookName}">
        <span>${bookName}</span>
    `;
    gallery.appendChild(newImageContainer);

    // הודעת הצלחה ואיפוס הטופס
    alert("הספר נוסף בהצלחה!");
    document.getElementById("add-book-form").reset();
});

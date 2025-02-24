function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// אלמנט ה-root שבו נטען את העמודים
const app = document.getElementById("app");
// טעינת תבנית לפי ID
function loadTemplate(templateId) {
  const template = document.getElementById(templateId).content.cloneNode(true);
  app.innerHTML = "";
  app.appendChild(template);
}

// מעבר בין עמודים
function handleRouting() {
  const hash = window.location.hash || "#login";

  if (hash === "#login") {
    loadTemplate("login-template");
    handleLogin();
  } else if (hash === "#registration") {
    loadTemplate("registration-template");
    handleRegistration();
  } else if (hash === "#ToDo") {
    const loggedInUser = localStorage.getItem("loggedInUser");
    FXMLHttpRequest.get(
      "/userDB/" + loggedInUser,
      (response) => {
        console.log("📥 Users received from server:", response);

        let user = response.data; // ⬅️ שימוש רק בנתונים שב`data`

        if (user) {
          loadTemplate("ToDo-template");
          handleToDo();
        } else {
          window.location.hash = "#login";
        }
      },
      (error) => {
        console.error("Error checking user: ", error);
        window.location.hash = "#login";
      }
    );
  } else {
    window.location.hash = "#login";
  }
}

// טיפול בעמוד הכניסה
function handleLogin() {
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    FXMLHttpRequest.post(
      "/userDB/login",
      { username, password },
      (response) => {
        console.log("📥 Users received from server:", response); // 🔍 בדיקה

        let user = response.data; // 🔹 שימוש במערך שבתוך `data`
        if (user) {
          localStorage.setItem("loggedInUser", user.id);
          window.location.hash = "#ToDo";
        } else {
          alert("שם משתמש או סיסמה לא נכונים");
        }
      },
      (error) => {
        console.error("Error logging in: ", error);
        alert("אירעה שגיאה בעת ניסיון ההתחברות");
      }
    );
    /*העברת שם משתמש וסיסמה לשרת משתמשים לצורך אימות 
        אם הפרטים אכן אומתו
            window.location.hash = "#ToDo";
        אם לא הצרת הודעת שגיאה*/
  });
}

// טיפול בעמוד הרישום
function handleRegistration() {
  const form = document.getElementById("registration-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const newUser = { id, email, password };

    FXMLHttpRequest.post(
      "/userDB",
      newUser,
      (response) => {
        if (response.status === 201) {
          alert("✅ ההרשמה הצליחה!");
          window.location.hash = "#login";
        } else {
          alert("❌ שגיאה בהרשמה: " + response.error);
        }
      },
      () => {
        alert("אירעה שגיאה בעת ניסיון הרשמה");
      }
    );
  });
}

// טיפול בעמוד המשימות
function handleToDo() {
  relodePage();

  setupEventListeners();
}

//טעינה מחדש של העמוד בלי לרענן אותו בשביל SPA
function relodePage() {
  const table = document.getElementById("ToDo-table");

  const headerHTML = `
        <tr>
            <th>ID</th>
            <th>משימה</th>
            <th>סטטוס</th>
            <th>תאריך סיום</th>
        </tr>
    `;

  table.innerHTML = headerHTML;

  const loggedInUser = getCookie("loggedInUser");

  FXMLHttpRequest.get("/taskDB", (response) => {
    let tasks = response.data;

    const userTasks = tasks.filter((task) => task.user === loggedInUser);

    userTasks.forEach((task) => {
      const row = table.insertRow();
      row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.finished ? "✅" : "❌"}</td>
            <td>${task.finishData}</td>`;
    });
  });
}

//ההזנה ללחיצה על כפתורים
function setupEventListeners() {
  const addButton = document.getElementById("add-btn");
  addButton.addEventListener("click", (event) => {
    event.preventDefault();

    const loggedInUser = getCookie("loggedInUser");

    const title = prompt("הכנס את כותרת המשימה");
    const finishData = prompt("הכנס את תאריך הסיום למשימה");

    if (!title || title.trim() === "") {
      alert("❌ לא ניתן ליצור משימה ללא תיאור!");
      return;
    }

    const newTask = {
      user: loggedInUser,
      id: Date.now(),
      title,
      finished: false,
      finishData: finishData,
    };

    FXMLHttpRequest.post("/taskDB", newTask, (response) => {
      if (response.status === 201) {
        alert("✅ המשימה נוספה בהצלחה!");
        relodePage();
      } else {
        alert("❌ שגיאה בהוספת משימה: ");
      }
    });
  });

  const updateButton = document.getElementById("update-btn");
  updateButton.addEventListener("click", (event) => {
    event.preventDefault();

    const index = prompt("🔹 הכנס את מספר זיהוי המשימה:");

    if (!index || isNaN(index)) {
      alert("❌ מספר זיהוי לא חוקי!");
      return;
    }

    const loggedInUser = getCookie("loggedInUser");

    FXMLHttpRequest.get(
      "/taskDB",
      (response) => {
        let task = response.data.find((task) => task.id == index);

        if (!task) {
          alert("❌ משימה לא נמצאה!");
          return;
        }

        const title = prompt("✏️ עדכן את המשימה:", task.title);
        const finished = confirm("✅ האם המשימה הושלמה?");
        const finishData = prompt("✏️ עדכן את תאריך הסיום:", task.finishData);

        const updatedTask = { user: loggedInUser, title, finished, finishData };

        FXMLHttpRequest.put(`/taskDB/${index}`, updatedTask, (response) => {
          if (response.status === 200) {
            alert("✅ המשימה עודכנה בהצלחה!");
            relodePage();
          } else {
            alert("❌ שגיאה בעדכון משימה: " + response.error);
          }
        });
      },
      () => {
        console.error("Error fetching tasks:");
      }
    );
  });

  const deleteButton = document.getElementById("delete-btn");
  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();

    const index = prompt("🔹 הכנס את מספר זיהוי המשימה למחיקה:");

    if (!index || isNaN(index)) {
      alert("❌ מספר זיהוי לא חוקי!");
      return;
    }

    FXMLHttpRequest.delete(`/taskDB/${index}`, (response) => {
      if (response.status === 200) {
        alert("✅ המשימה נמחקה בהצלחה!");
        relodePage();
      } else {
        alert("❌ שגיאה במחיקת משימה: " + response.error);
      }
    });
  });

  const deleteUserButton = document.getElementById("delete-user-btn");
  deleteUserButton.addEventListener("click", (event) => {
    event.preventDefault();

    const password = prompt("🔹 הכנס סיסמא");

    FXMLHttpRequest.get("/userDB", (response) => {
      const loggedInUser = getCookie("loggedInUser");
      let users = response.data;
      const user = users.find(
        (u) => u.id === loggedInUser && u.password === password
      );

      if (user) {
        FXMLHttpRequest.delete(`/taskDB/`, (response) => {
          if (response.status === 200) {
            FXMLHttpRequest.delete(`/userDB/`, (response) => {
              if (response.status === 200) {
                alert("✅ המשתמש נמחק");
                document.cookie = "loggedInUser=; max-age=0";
                window.location.hash = "#login";
              } else {
                alert("❌ שגיאה במחיקת המשתמש: " + response.error);
              }
            });
          } else {
            alert("❌ שגיאה במחיקת משימות: " + response.error);
          }
        });
      } else {
        alert("❌ הסיסמה שגויה: ");
      }
    });
  });

  const logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    document.cookie = "loggedInUser=; max-age=0";
    window.location.hash = "#login";
  });
}

// האזנה לשינויים ב-URL
window.addEventListener("hashchange", handleRouting);

// טעינה ראשונית
handleRouting();

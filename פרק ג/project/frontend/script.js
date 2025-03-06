function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
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

        FXMLHttpRequest.get("/userDB", (response) => {

            let users = response.data;
            
            const loggedInUser = getCookie('loggedInUser');

            if (users.some(user => user.user === loggedInUser)) {
                loadTemplate("ToDo-template");
                handleToDo();
            } else {
                window.location.hash = "#login";
            }
        }, () => {
            window.location.hash = "#login";
        });

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

        FXMLHttpRequest.get("/userDB", (response) => {

            let users = response.data;
            
            const user = users.find(u => u.user === username && u.password === password);

            if (user) {
                alert("✅ ברוך הבא!");
                document.cookie = `loggedInUser=${username}; max-age=7200`;
                window.location.hash = "#ToDo";
            } else {
                alert("שם משתמש או סיסמה לא נכונים");
            }
        }, () => {
            alert("אירעה שגיאה בעת ניסיון ההתחברות");
        });
    });
}


// טיפול בעמוד הרישום
function handleRegistration() {
    const form = document.getElementById("registration-form");
    form.addEventListener("submit", (event) => {

        event.preventDefault();
        
        const user = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        const newUser = { user, email, password };

        FXMLHttpRequest.post("/userDB", newUser, (response) => {
            if (response.status === 201) {//HTTP_STATUS_CODES.CREATED
                alert("✅ ההרשמה הצליחה!");
                window.location.hash = "#login";
            } else {
                alert("❌ שגיאה בהרשמה: " + response.error);
            }
        }, () => {
            alert("אירעה שגיאה בעת ניסיון הרשמה");
        });
    });
}


// טיפול בעמוד המשימות
function handleToDo() {
    
    relodePage();

    setupEventListeners();
}


//טעינה מחדש של העמוד בלי לרענן אותו בשביל SPA
function relodePage(){
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

    const loggedInUser = getCookie('loggedInUser');

    FXMLHttpRequest.get("/taskDB", (response) => {

        let tasks = response.data;

        const userTasks = tasks.filter(task => task.user === loggedInUser);

        userTasks.forEach(task => {
            const row = table.insertRow();
            row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.finished ? "✅" : "❌"}</td>
            <td>${task.finishDate}</td>`;
        });
    });
}


//ההזנה ללחיצה על כפתורים
function setupEventListeners(){
    const addButton = document.getElementById("add-btn");
    addButton.addEventListener("click", (event) => {

        event.preventDefault();

        const loggedInUser = getCookie('loggedInUser');
        
        const title = prompt("הכנס את כותרת המשימה")
        const description = prompt("הכנס את תיאור המשימה")
        const finishDate = prompt("הכנס את תאריך הסיום למשימה")

        if (!title || title.trim() === "") {
            alert("❌ לא ניתן ליצור משימה ללא כותרת!");
            return;
        }

        if (!description || description.trim() === "") {
            alert("❌ לא ניתן ליצור משימה ללא תיאור!");
            return;
        }

        const newTask = {
            user: loggedInUser,
            id: Date.now(),
            title,
            description,
            finished: false,
            finishDate: finishDate,
        };

        FXMLHttpRequest.post("/taskDB", newTask, (response) => {
            if (response.status === 201) {//HTTP_STATUS_CODES.CREATED
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

        const taskId = prompt("🔹 הכנס את מספר זיהוי המשימה:");
    
        if (!taskId || isNaN(taskId)) {
            alert("❌ מספר זיהוי לא חוקי!");
            return;
        }

        const loggedInUser = getCookie('loggedInUser');

        FXMLHttpRequest.get("/taskDB", (response) => {

            let task = response.data.find(task => task.id == taskId);

            if (!task) {
                alert("❌ משימה לא נמצאה!");
                return;
            }

            const title = prompt("✏️ עדכן את המשימה:", task.title);
            const finished = confirm("✅ האם המשימה הושלמה?");
            const finishDate = prompt("✏️ עדכן את תאריך הסיום:", task.finishDate);

            const updatedTask = { title, finished, finishDate };

            FXMLHttpRequest.put(`/taskDB/${taskId}`, updatedTask, (response) => {
                if (response.status === 200) {//HTTP_STATUS_CODES.OK
                    alert("✅ המשימה עודכנה בהצלחה!");
                    relodePage();
                } else {
                    alert("❌ שגיאה בעדכון משימה: " + response.error);
                }
            });
        }, () => {
            console.error("Error fetching tasks:");
        });
    });


    const deleteButton = document.getElementById("delete-btn");
    deleteButton.addEventListener("click", (event) => {

        event.preventDefault();

        const taskId = prompt("🔹 הכנס את מספר זיהוי המשימה למחיקה:");

        if (!taskId || isNaN(taskId)) {
            alert("❌ מספר זיהוי לא חוקי!");
            return;
        }
        
        FXMLHttpRequest.delete(`/taskDB/${taskId}`, (response) => {
            if (response.status === 200) {//HTTP_STATUS_CODES.OK
                alert("✅ המשימה נמחקה בהצלחה!");
                relodePage();
            } else {
                alert("❌ שגיאה במחיקת משימה: " + response.error);
            }
        });
    });

    const descriptionbutten = document.getElementById("description-btn");
    descriptionbutten.addEventListener("click", (event) => {

        event.preventDefault();

        const taskId = prompt("🔹 הכנס את מספר זיהוי המשימה:");

        if (!taskId || isNaN(taskId)) {
            alert("❌ מספר זיהוי לא חוקי!");
            return;
        }

        FXMLHttpRequest.get("/taskDB", (response) => {
                let tasks = response.data;
                tasks = Array.isArray(tasks) ? tasks : [];
        
                const task = tasks.find(task => task.id == taskId && task.user == getCookie('loggedInUser'));
                if (!task) {
                    alert("❌ משימה לא נמצאה!");
                    return;
                }

                document.getElementById("description").innerHTML = `
                <h2>פרטי משימה</h2>
                <p><strong>ID:</strong> ${task.id}</p>
                <p><strong>משימה:</strong> ${task.title || "ללא כותרת"}</p>
                <p><strong>תיאור:</strong> <input type="text" id="edit-description" value="${task.description}" /></p>
                <p><strong>סטטוס:</strong> ${task.finished ? "✅ הושלמה" : "❌ לא הושלמה"}</p>
                <p><strong>תאריך סיום:</strong> ${task.finishDate || "לא נקבע"}</p>

                <button id="save-description-btn">💾 שמור שינויים</button>
                <button id="exit-btn">🔙 חזרה</button>
                `;

                document.getElementById("mainToDo").classList.add('hidden');
                document.getElementById("description").classList.remove('hidden');

                
                document.getElementById("save-description-btn").addEventListener("click", () => {
                const newDescription = document.getElementById("edit-description").value.trim();
                if (!newDescription) {
                    alert("❌ תיאור לא יכול להיות ריק!");
                    return;
                }

                const updatedTask = { user: getCookie('loggedInUser'), description: newDescription };

                FXMLHttpRequest.put(`/taskDB/${task.id}`, updatedTask, (response) => {
                    if (response.status === 200) {//HTTP_STATUS_CODES.OK
                        alert("✅ תיאור המשימה עודכן בהצלחה!");
                    } else {
                        alert("❌ שגיאה בעדכון המשימה: " + response.error);
                    }
                });
            });

            document.getElementById("exit-btn").addEventListener("click", () => {
                document.getElementById("description").classList.add("hidden");
                document.getElementById("mainToDo").classList.remove('hidden');
            });
        });
    });


    const deleteUserButton = document.getElementById("delete-user-btn");
    deleteUserButton.addEventListener("click", (event) => {

        event.preventDefault();

        const password = prompt("🔹 הכנס סיסמא");

        FXMLHttpRequest.get("/userDB", (response) => {

            const loggedInUser = getCookie('loggedInUser');
            let users = response.data;
            const user = users.find(u => u.user === loggedInUser && u.password === password);

            if(user){
                FXMLHttpRequest.delete("/taskDB", (response) => {
                    if (response.status === 200) {//HTTP_STATUS_CODES.OK
                        FXMLHttpRequest.delete("/userDB", (response) => {
                            if (response.status === 200) {//HTTP_STATUS_CODES.OK
                                alert("✅ המשתמש נמחק");
                                document.cookie = "loggedInUser=; max-age=0";
                                window.location.hash = "#login";
                            }
                            else{
                                alert("❌ שגיאה במחיקת המשתמש: " + response.error);
                            }
                        })
                    } else {
                        alert("❌ שגיאה במחיקת משימות: " + response.error);
                    }
                });
            }else{
                alert("❌ הסיסמה שגויה: ");
            }
        })
    });


    const updateUserButton = document.getElementById("update-user-btn");
    updateUserButton.addEventListener("click", (event) => {

        event.preventDefault();

        const password = prompt("🔹 הכנס סיסמא");

        FXMLHttpRequest.get("/userDB", (response) => {

            const loggedInUser = getCookie('loggedInUser');
            let users = response.data;
            const user = users.find(u => u.user === loggedInUser && u.password === password);

            if(user){

                const newUserName = prompt("🔹 הכנס שם משתמש חדש" ,user.id);

                updateUserName = {user: newUserName};

                FXMLHttpRequest.put("/taskDB",updateUserName, (response) => {
                    if (response.status === 200) {//HTTP_STATUS_CODES.OK
                        FXMLHttpRequest.put("/userDB",updateUserName, (response) => {
                            if (response.status === 200) {//HTTP_STATUS_CODES.OK
                                alert("✅ המשתמש עודכן");
                                document.cookie = "loggedInUser=; max-age=0";
                                document.cookie = `loggedInUser=${newUserName}; max-age=7200`;
                                relodePage();
                            }
                            else{
                                alert("❌ שגיאה בעדכון המשתמש: " + response.error);
                            }
                        })
                    } else {
                        alert("❌ שגיאה בעדכון משימות: " + response.error);
                    }
                });
            }else{
                alert("❌ הסיסמה שגויה: ");
            }
        })
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

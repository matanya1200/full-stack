// אלמנט ה-root שבו נטען את העמודים
const app = document.getElementById("app");
let users = localStorage.getItem("userDB")
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
            console.log("📥 Users received from server:", response); 

            let users = response.data; // ⬅️ שימוש רק בנתונים שב`data`
            users = Array.isArray(users) ? users : []; // ווידוא שזה מערך
            
            const loggedInUser = localStorage.getItem("loggedInUser");
            if (users.some(user => user.username === loggedInUser)) {
                loadTemplate("ToDo-template");
                handleToDo();
            } else {
                window.location.hash = "#login";
            }
        }, (error) => {
            console.error("Error checking user: ", error);
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
            console.log("📥 Users received from server:", response); // 🔍 בדיקה

            let users = response.data; // 🔹 שימוש במערך שבתוך `data`
            users = Array.isArray(users) ? users : [];
            
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem("loggedInUser", username);
                window.location.hash = "#ToDo";
            } else {
                alert("שם משתמש או סיסמה לא נכונים");
            }
        }, (error) => {
            console.error("Error logging in: ", error);
            alert("אירעה שגיאה בעת ניסיון ההתחברות");
        });
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
        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        const newUser = { username, email, password };
        console.log("📝 Form submitted with user:", newUser);

        FXMLHttpRequest.post("/userDB", newUser, (response) => {
            console.log("📬 Server response:", response); // בדיקה - האם השרת מחזיר תשובה?
            if (response.status === 201) {
                alert("✅ ההרשמה הצליחה!");
                window.location.hash = "#login";
            } else {
                alert("❌ שגיאה בהרשמה: " + response.error);
            }
        /*FXMLHttpRequest.get("/userDB", (users) => {
            if (users.some(user => user.username === username || user.email === email)) {
                alert("שם משתמש או אימייל כבר קיימים");
            } else {
                FXMLHttpRequest.post("/userDB", newUser, () => {
                    alert("ההרשמה הצליחה!");
                    window.location.hash = "#login";
                }, (error) => {
                    console.error("Error registering: ", error);
                    alert("אירעה שגיאה בעת ניסיון ההרשמה");
                });
            }*/
        });

        /*העברת שם משתמש ,סיסמה ואימייל לשרת משתמשים לצורך בדיקה אם קיים משתמש 
        אם אכן קיים משתמש תוצג הודעת שגיאה 
        אם לא השרת יוסיף את המשתמש החדש לDB
            window.location.hash = "#login";*/
        
    });
}

function relodePage(){
    const table = document.getElementById("ToDo-table");
    // שמירת כותרת הטבלה
    const headerHTML = `
        <tr>
            <th>ID</th>
            <th>תיאור</th>
            <th>סטטוס</th>
            <th>תאריך התחלה</th>
        </tr>
    `;

    table.innerHTML = headerHTML; // מחיקת כל התוכן אך שמירה על הכותרת

    const loggedInUser = localStorage.getItem("loggedInUser");
    
    FXMLHttpRequest.get("/taskDB", (response) => {
        console.log("📥 Tasks received from server:", response);

        let tasks = response.data; // ⬅️ שימוש רק בנתונים שב`data`
        tasks = Array.isArray(tasks) ? tasks : []; // ווידוא שזה מערך

        const userTasks = tasks.filter(task => task.user === loggedInUser);

        userTasks.forEach(task => {
            const row = table.insertRow();
            row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.description}</td>
            <td>${task.finished ? "✅" : "❌"}</td>
            <td>${task.start_date}</td>`;
        });
    }, (error) => {
        console.error("Error fetching tasks: ", error);
    });
}

function setupEventListeners(){
    /*const getButton = document.getElementById("get-btn");
    getButton.addEventListener("click", () => {
        const index = prompt("הכנס את מספר המשימה")
        /*שליחה בקשה לשרת ע"י שימוש fajax  לקבל את המשימה עם האינדקס ואז מציגים אתה  */
    //});

    const addButton = document.getElementById("add-btn");
    addButton.addEventListener("click", () => {
        const description = prompt("הכנס את תיאור המשימה")

        const newTask = {
            user: localStorage.getItem("loggedInUser"),
            id: Date.now(),//? אולי עדיף להשתמש במונה או לשלוף את כל המשימות ולקחת את הidשל המשימה האחרונה ועוד 1
            description,
            finished: false,
            start_date: new Date().toLocaleDateString(),
        };

        FXMLHttpRequest.post("/taskDB", newTask, (response) => {
            console.log("📬 Server response:", response); // 🔍 בדיקה
        if (response.status === 201) {
            alert("✅ המשימה נוספה בהצלחה!");
            relodePage(); // ⬅️ במקום לרענן את הדף, מרנדרים מחדש את הטבלה
        } else {
            alert("❌ שגיאה בהוספת משימה: " + response.error);
        }
        });
    });

    const updateButton = document.getElementById("update-btn");
    updateButton.addEventListener("click", () => {
        const index = prompt("🔹 הכנס את מספר זיהוי המשימה:");
    
        if (!index || isNaN(index)) {
            alert("❌ מספר זיהוי לא חוקי!");
            return;
        }

        const loggedInUser = localStorage.getItem("loggedInUser");
        console.log("👤 Logged in user:", loggedInUser); // 🔍 בדיקה

        FXMLHttpRequest.get("/taskDB", (response) => {
            let tasks = response.data;
            tasks = Array.isArray(tasks) ? tasks : [];

            const task = tasks.find(task => task.id == index); // חיפוש המשימה

            if (!task) {
                alert("❌ משימה לא נמצאה!");
                return;
            }

            const description = prompt("✏️ הכנס את התיאור החדש של המשימה:", task.description);
            const finished = confirm("✅ האם המשימה הושלמה?");

            const updatedTask = { user: loggedInUser, description, finished };

            FXMLHttpRequest.put(`/taskDB/${index}`, updatedTask, (response) => {
                if (response.status === 200) {
                    alert("✅ המשימה עודכנה בהצלחה!");
                    relodePage(); // ⬅️ במקום לרענן את הדף, מרנדרים מחדש את הטבלה
                } else {
                    alert("❌ שגיאה בעדכון משימה: " + response.error);
                }
            });
        }, (error) => {
            console.error("Error fetching tasks:", error);
        });
    });


    const deleteButton = document.getElementById("delete-btn");
    deleteButton.addEventListener("click", () => {
        const index = prompt("🔹 הכנס את מספר זיהוי המשימה למחיקה:");
        if (!index || isNaN(index)) {
            alert("❌ מספר זיהוי לא חוקי!");
            return;
        }
        
        FXMLHttpRequest.delete(`/taskDB/${index}`, (response) => {
            if (response.status === 200) {
                alert("✅ המשימה נמחקה בהצלחה!");
                relodePage(); // ⬅️ במקום לרענן את הדף, מרנדרים מחדש את הטבלה
            } else {
                alert("❌ שגיאה במחיקת משימה: " + response.error);
            }
        });
    });

    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.hash = "#login";
    });
}

// טיפול בעמוד המשחק
function handleToDo() {
    
    relodePage();

    setupEventListeners();
}



// האזנה לשינויים ב-URL
window.addEventListener("hashchange", handleRouting);

// טעינה ראשונית
handleRouting();













/*
מימוש מחלקת FXMLHttpRequest המדמה AJAX.
כל פנייה לשרת תהיה אסינכרונית ותשתמש באובייקט חדש של FXMLHttpRequest.
צריך להוסיף עמוד network.js שיממש את הפונקציות של FAJAX
כיוון שאנו לא עובדים עם שרתים אמיתים הפונקציות של FAJAX יהיו בנויות כמו הפונקציות של AJAX אבל במקום 
ליצור בקשה עבור שרת הבקשה תועבר לקובצי js שיעבדו כאילו הם שרתים 
הבקשות ישלחו בפורמט של json והתשובות מהשרת גם יגיעו בפרמט של json*/

/*צריך להוסיף עמוד BD.js שיממש את הפונקציות של REST-API
GET – בלי אינדקס – שליפת כל הרשומות
GET – עם אינדקס – שליפת רשומה מסוימת
POST – בלי אינדקס ועם מידע – הוספת רשומה חדשה
PUT – עם אינדקס ועם מידע – עדכון רשומה קיימת
DELETE – עם אינדקס – מחיקת רשומה קיימת
בנוסף כל פונקציה תקבל גם מידע אם היא צריכה לפעול מול userDB או מול taskDB*/

/*צריך להוסיף עמוד user-server  שישתמש בפונקציות REST-API שנמצאות בקובץ DB.js בשביל לפנות לuserDB*/

/*צריך להוסיף עמוד task-server  שישתמש בפונקציות REST-API שנמצאות בקובץ DB.js בשביל לפנות לtaskDB*/

/*שני השרתים יעשו גם בדיקת קלט עבור הנתונים
עבור העמוד כניסה אם המשתמש לא רשום תוחזר הודעת שגיאה בפורט json
עבור העמוד כניה אם כבר קיים משתמש עם השם משתמש או האימייל שקבנו תוחזר הודעת שגיאה בפומט json
עבור עמוד המשימות אם אני מנסה למחוק משימה שלא קיימת תוחזר שגיאה 
אם אני מנשה לערוך משימה שלא קיימת תוחזר שגיאה
אם אני מנשה להציד משימה שלא תיימת תוחזר שגיאה
כל השגיאות יוחזרו בפורמט json  בעזרת שימוש בפונקציות של FAJAX */

/*userDB ו taskDB שני מאגרי מידע 
המימוש שלהם הוא מאגרי רשומות בזיכרון המקומי LS כמו שעשיתי בקובץ main1
כל רשומה היא אוביקט json עם השדות המתאימים 
דוגמא:
{
    "userDB" : [
            { 
                "username" : "username1" ,          key
                "password" : "pasword1" ,           key
                "eamil" : "m@gmail.com"             key
            } , 
            {
                "username" : "username2" ,
                "password" : "pasword2" , 
                "eamil" : "n@gmail.com"
            }
        ] ,
    "taskDB" : [
            {
                "user" : "username1" ,              key
                "id" : 1 ,                          key
                "description" : "description1" ,
                "finised" : true , 
                "start_date" : "15/1/2025" 
            } , 
            {
                "user" : "username2" , 
                "id" : 1 ,
                "description" : "description2" ,
                "finised" : true , 
                "start_date" : "22/1/2025" 
            } , 
            {
                "user" : "username1" , 
                "id" : 2 ,
                "description" : "description2" ,
                "finised" : false , 
                "start_date" : "17/1/2025" 
            }
        ]
}
    

בדוגמא הזו קיימות 2 רשומרות רשומה של משתמשים userDB ורשומה של משימות taskDB
ברשומת המשתמשים יש 2 משתמשים usename1,usernae2
ברשומת המשתמשים כל שדה הוא מפתח בפני עצמו ולכן כל השדות צריכות להיות שונות בין 2 משתמשים

ברשומת המשימות יש 3 משימות 
שני משימות שייכות למשתמש1 ומשימה 1 שייכתת למשתמש2
ברשומת המשימות המפתח מורכב מ2 שדות המשתמש והמספר זיהוי של המשימה 
לכן יכול להיות מצב בו יהיו ל2 משימות אותו שם משתמש או אותו מספר זיהיו 
אבל אין מצב של2 משימותיהיו גם אותו שם משתמש וגם אותו מספר זיהוי
*/

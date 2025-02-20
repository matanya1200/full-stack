// פונקציית AJAX כללית
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// עדכון התצוגה ב-DOM
function updateOutput(content) {
    const output = document.getElementById("output");
    output.innerHTML = content;
}

// שליפת מידע על Luke Skywalker
async function getLukeInfo() {
    const data = await fetchData("https://swapi.dev/api/people/?search=luke");
    const luke = data.results[0];
    updateOutput(`Height: ${luke.height}, Eye Color: ${luke.eye_color}, birth year: ${luke.birth_year}`);
}

// שליפת שמות סרטים של George Lucas
async function getFilmsByDirector() {
    const data = await fetchData("https://swapi.dev/api/films/");
    const films = data.results.filter(film => film.director === 'George Lucas');
    const filmTitles = films.map(film => film.title).join("<br>");
    updateOutput(`Films by ${'George Lucas'}:<br>${filmTitles}`);
}

// שליפת סרטים בהם השתתף Darth Vader
async function getFilmsByCharacter() {
    const data = await fetchData(`https://swapi.dev/api/people`);
    const character = data.results[3];
    const filmPromises = character.films.map(filmUrl => fetchData(filmUrl));
    const films = await Promise.all(filmPromises);
    const filmTitles = films.map(film => film.title).join("<br>");
    updateOutput(`Films featuring "Darth Vader":<br>${filmTitles}`);
}

// שליפת תיאורי משימות עבור username1 בלבד
async function getTasksForUser(username) {
    const DB = await fetchData("./DB.json");
    //העלאת בסיס הנתונים לLS בשני דרכים
    localStorage.setItem("userDB", JSON.stringify(DB.userDB));
    localStorage.setItem("taskDB", JSON.stringify(DB.taskDB));
    localStorage.setItem("DB", JSON.stringify(DB));
    // סינון המשימות שקשורות למשתמש הרצוי
    const userTasks = DB.taskDB.filter(task => task.user === username);

    console.log(userTasks.map(task => task.start_date))
    // הדפסת התיאורים בלבד
    const taskDescriptions = userTasks.map(task => task.description).join("<br>");
    updateOutput(`
        <h2>Tasks for ${username}:</h2>
        ${taskDescriptions || "No tasks found for this user."}
    `);
}

// קריאה לפונקציה להצגת המשימות של username1
getTasksForUser("username1");


// חיבור הכפתורים לאירועים
document.getElementById("luke-btn").addEventListener("click", getLukeInfo);
document.getElementById("lucas-films-btn").addEventListener("click", () => getFilmsByDirector());
document.getElementById("vader-films-btn").addEventListener("click", () => getFilmsByCharacter());

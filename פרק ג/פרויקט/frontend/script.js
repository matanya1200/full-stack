const app = document.getElementById("app");
const loader = document.querySelector(".loader");

function loadTemplate(templateId) {
  const template = document.getElementById(templateId).content.cloneNode(true);
  app.innerHTML = "";
  app.appendChild(template);
}

function handleRouting() {
  let hash = window.location.hash || "#login";

  const loggedInUser = getCookie("loggedInUser");
  if (loggedInUser && (hash === "#login" || hash === "#registration")) {
    window.location.hash = "#ToDo";
  } else if (!loggedInUser && hash === "#ToDo") {
    window.location.hash = "#login";
  }

  if (hash === "#login") {
    loadTemplate("login-template");
    handleLogin();
  } else if (hash === "#registration") {
    loadTemplate("registration-template");
    handleRegistration();
  } else if (hash === "#ToDo") {
    loadTemplate("ToDo-template");
    handleToDo();
  } else if (hash.startsWith("#update-task")) {
    loadTemplate("edit-task-template");
    setupTodoUpdate();
  } else {
    loadTemplate("404-template");
  }
}

function handleLogin() {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    makeRequest(
      HTTP_METHODS.POST,
      "/users/login",
      { username, password },
      (user) => {
        if (user) {
          setCookie("loggedInUser", user.id, 1);
          window.location.hash = "#ToDo";
        } else {
          alert("שם משתמש או סיסמה לא נכונים");
        }
      },
      () => {
        alert("אירעה שגיאה בעת ניסיון ההתחברות");
      }
    );
  });
}

function handleRegistration() {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const newUser = { username, email, password };

    makeRequest(
      HTTP_METHODS.POST,
      "/users/registration",
      newUser,
      () => {
        window.location.hash = "#login";
      },
      (error) => {
        alert("❌ שגיאה בהרשמה: " + error);
      }
    );
  });
}

function handleToDo() {
  loadTasks();
  setupEventListeners();
}

function updatedTask() {
  const taskId = this.getAttribute("data-id");
  window.location.hash = `#update-task/${taskId}`;
}

function deleteTask() {
  const taskId = this.getAttribute("data-id");
  const loggedInUser = getCookie("loggedInUser");

  makeRequest(
    HTTP_METHODS.DELETE,
    `/tasks/${taskId}`,
    { user: loggedInUser },
    () => {
      this.closest("tr").remove();

      const table = document.querySelector("#ToDo-table tbody");
      if (table.rows.length === 0) {
        document.getElementById("empty-tasks").classList.remove("hidden");
      }
    },
    (error) => {
      alert("❌ שגיאה במחיקת משימה: " + error);
    }
  );
}

function addRow(table, task) {
  const row = table.insertRow(0);

  row.innerHTML = `
    <td>${task.title}</td>
    <td>${task.finished ? "✅" : "❌"}</td>
    <td>${task.finishData}</td>
    <td></td>
  `;

  // edit icon
  const editButton = document.createElement("button");
  editButton.classList.add("icon-btn");
  editButton.addEventListener("click", updatedTask);
  editButton.innerHTML = `<img src="/frontend/assets/edit.svg" />`;
  editButton.setAttribute("data-id", task.id);

  // delete icon
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("icon-btn");
  deleteButton.addEventListener("click", deleteTask);
  deleteButton.innerHTML = `<img src="/frontend/assets/delete.svg" />`;
  deleteButton.setAttribute("data-id", task.id);

  // add to last td
  row.cells[3].appendChild(editButton);
  row.cells[3].appendChild(deleteButton);
}

function loadTasks(search = "") {
  const table = document.querySelector("#ToDo-table tbody");
  const loggedInUser = getCookie("loggedInUser");

  makeRequest(
    HTTP_METHODS.GET,
    "/tasks",
    { user: loggedInUser, search },
    (tasks) => {
      table.innerHTML = "";
      tasks.forEach((task) => addRow(table, task));
      if (tasks.length === 0) {
        document.getElementById("empty-tasks").classList.remove("hidden");
      } else {
        document.getElementById("empty-tasks").classList.add("hidden");
      }
    }
  );
}

function setupEventListeners() {
  const loggedInUser = getCookie("loggedInUser");

  const addTaskForm = document.getElementById("add-task-form");
  addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(addTaskForm);
    const title = formData.get("task-name");
    const finishData = formData.get("task-date");

    const newTask = {
      title,
      finishData,
      finished: false,
      user: loggedInUser,
    };

    makeRequest(
      HTTP_METHODS.POST,
      "/tasks",
      newTask,
      (response) => {
        const emptyTasks = document.getElementById("empty-tasks");
        if (!emptyTasks.className.includes("hidden")) {
          emptyTasks.classList.add("hidden");
        }

        const table = document.querySelector("#ToDo-table tbody");
        addRow(table, response);
        addTaskForm.reset();
      },
      () => {
        alert("❌ שגיאה בהוספת משימה");
      }
    );
  });

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadTasks(searchInput.value);
    }
  });

  const logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("click", () => {
    deleteCookie("loggedInUser");
    window.location.hash = "#login";
  });
}

function setupTodoUpdate() {
  const loggedInUser = getCookie("loggedInUser");
  const taskId = window.location.hash.split("/")[1];
  const form = document.getElementById("edit-task-form");

  makeRequest(
    HTTP_METHODS.GET,
    `/tasks/${taskId}`,
    { user: loggedInUser },
    (task) => {
      // fill the form with the task data
      form.taskId = task.id;
      form.querySelector("#edit-task-name").value = task.title;
      form.querySelector("#edit-task-date").value = task.finishData;
      form.querySelector("#edit-task-completed").checked = task.finished;

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get("edit-task-name");
        const finishData = formData.get("edit-task-date");
        const finished = formData.get("edit-task-completed");

        const updatedTask = { title, finishData, finished, user: loggedInUser };

        makeRequest(
          HTTP_METHODS.PUT,
          `/tasks/${taskId}`,
          updatedTask,
          () => {
            window.location.hash = "#ToDo";
          },
          (error) => {
            alert("❌ שגיאה בעדכון משימה: " + error);
          }
        );
      });
    },
    () => {
      alert("❌ שגיאה בטעינת המשימה");
    }
  );
}

window.addEventListener("hashchange", handleRouting);
handleRouting();

function makeRequest(method, url, data, onload, onerror) {
  loader.classList.remove("hidden");
  const xhr = new FXMLHttpRequest();
  xhr.open(method, url);

  xhr.onload = () => {
    if (xhr.status >= HTTP_STATUS_CODES.BAD_REQUEST) {
      onerror(xhr.responseText);
    } else {
      try {
        onload(JSON.parse(xhr.responseText));
      } catch {
        onload(xhr.responseText);
      }
    }
    loader.classList.add("hidden");
  };
  xhr.onerror = () => {
    alert("שגיאה בשליחת הבקשה. נסה שנית.");
    loader.classList.add("hidden");
  };

  xhr.send(JSON.stringify(data));
}

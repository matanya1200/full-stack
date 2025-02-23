class FXMLHttpRequest {
  static get(url, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url);
        callback(response);
    }, 500);
  }

  static post(url, data, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url, data);
        callback(response);
    }, 500);
  }

  static put(url, data, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url, data);
        callback(response);
    }, 500);
  }

  static delete(url, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url);
        callback(response);
    }, 500);
  }

  static deleteAllTasks(url, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url);
        callback(response);
    }, 500);
  }

  static deleteUser(url, callback) {
    setTimeout(() => {
        const response = this.mockRequest(url);
        callback(response);
    }, 500);
  }

  static mockRequest(url, data = null) {
    if (url === "/userDB") {
        if (data) {
            // קריאה לרישום משתמש חדש
            const response = UserServer.registerUser(data);
            return response;
        }
          
        return { status: 200, data: UserServer.getUsers() };
        /*const DB = new Database("userDB");
        const users = DB.getAll();
        return { status: 200, data: Array.isArray(users) ? users : [] }; // וידוא החזרת מערך*/
    }

    //מחיקת המשתמש
    if(url === "/userDB/"){
      const loggedInUser = localStorage.getItem("loggedInUser");

      return UserServer.deleteUser(loggedInUser);
    }

    if (url.startsWith("/taskDB/")) {

      const loggedInUser = localStorage.getItem("loggedInUser");

      //מחיקת כל המשימות של המשתמש
      if(url === "/taskDB/"){
        return TaskServer.deleteUser(loggedInUser);
      }
      
      const taskId = Number(url.split("/taskDB/")[1]); // חילוץ ה-ID כ-Number

      if (data) { 
        // אם יש מידע, זו בקשת עדכון
        return TaskServer.updateTask(data.user, taskId, data);
      }

      // אחרת זו מחיקה
      return TaskServer.deleteTask(loggedInUser, taskId);        
    }

    if (url.startsWith("/taskDB")) {
      //const DB = new Database("taskDB");
      return data ? TaskServer.addTask(data.user, data) : { status: 200, data: TaskServer.getAllTasks() };
    }

    return { status: 404, error: "Not Found" };
  }
}
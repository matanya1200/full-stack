class FXMLHttpRequest {
  static get(url, callback) {
    setTimeout(() => {
      const response = this.mockRequest(url);
      callback(response);
    }, 500);
  }

  static post(url, data, callback) {
    console.log(`📡 Sending POST request to ${url} with data:`, data);

    setTimeout(() => {
      const response = this.mockRequest(url, data);
      console.log(`📡 Response from ${url}:`, response);
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

  static mockRequest(url, data = null) {
    console.log("📡 Mock request to:", url, "with data:", data);

    if (url === "/userDB") {
      if (data) {
        // קריאה לרישום משתמש חדש
        const response = UserServer.registerUser(data);
        console.log("🖥️ UserServer response:", response);
        return response;
      }

      const usersDB = new Database("userDB");
      const users = usersDB.getAll();
      console.log("📤 Returning users from DB:", users); // בדיקה מה מוחזר בפועל
      return { status: 200, data: Array.isArray(users) ? users : [] }; // וידוא החזרת מערך
    }

    if (url.startsWith("/taskDB/")) {
      const taskId = Number(url.split("/taskDB/")[1]); // חילוץ ה-ID כ-Number
      console.log("📩 Updating Task ID:", taskId, "With Data:", data); // 🔍 בדיקה

      if (data) {
        // אם יש מידע, זו בקשת עדכון
        return TaskServer.updateTask(data.user, taskId, data);
      }

      // אחרת זו מחיקה
      console.log("🗑 Deleting Task ID:", taskId); // 🔍 בדיקה
      const loggedInUser = localStorage.getItem("loggedInUser");
      return TaskServer.deleteTask(loggedInUser, taskId);
    }

    if (url.startsWith("/taskDB")) {
      const taskDb = new Database("taskDB");
      return data
        ? TaskServer.addTask(data.user, data)
        : { status: 200, data: taskDb.getAll() };
    }

    return { status: 404, error: "Not Found" };
  }
}

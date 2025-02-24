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

  static mockRequest(url, data = null) {

    //רישום משתמש (אם מקבלים מידע) או קבלת כל המשתמשים
    if (url === "/userDB") {
      return data ? UserServer.addUser(data) : UserServer.getUsers();
    }

    //הוספת משימה (אם מקבלים מידע) או קבלת כל המשימות
    if (url === "/taskDB") {
      return data ? TaskServer.addTask(data.user, data) : TaskServer.getAllTasks() ;
    }

    
    //מחיקת המשתמש
    if(url === "/userDB/"){
      return UserServer.deleteUser(getCookie("loggedInUser"));
    }
    

    if (url.startsWith("/taskDB/")) {
      
      const taskId = Number(url.split("/taskDB/")[1]);

      //מחיקת כל המשימות של המשתמש
      if(url === "/taskDB/"){
        let tasks = TaskServer.getAllTasks().data.filter(task => task.user == getCookie("loggedInUser"));
        tasks.forEach(task => {
          TaskServer.deleteTask(task.user,task.id);
        });
        return { status: 200, message: "all you're taskd been deleted" };
      }

      // אם יש מידע זו בקשת עדכון ואם אין זו בקשת מחיקה
      return data ? TaskServer.updateTask(data.user, taskId, data) : TaskServer.deleteTask(getCookie("loggedInUser"), taskId);       
    }

    return { status: 404, error: "Not Found" };
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return decodeURIComponent(value);
  }
  return null;
}
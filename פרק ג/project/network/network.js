class FXMLHttpRequest {
  static get(url, callback) {
      this.sendRequest("GET", url, null, callback);
  }

  static post(url, data, callback) {
      this.sendRequest("POST", url, data, callback);
  }

  static put(url, data, callback) {
      this.sendRequest("PUT", url, data, callback);
  }

  static delete(url, callback) {
      this.sendRequest("DELETE", url, null, callback);
  }

  static sendRequest(method, url, data, callback) {

    // קביעת השהיה אקראית בין 1 ל-3 שניות
    //const delay = Math.random() * 2000 + 1000; // 1000ms - 3000ms
        
    // קביעת הסתברות השמטה (בין 10% ל-50%)
    //const dropRate = Math.random() * 0.4 + 0.1; // בין 0.1 ל-0.5

      setTimeout(() => {

        /*if (Math.random() < dropRate) {
          console.warn(`🚨 הודעה ל-${url} הושמטה (הסתברות: ${(dropRate * 100).toFixed(1)}%)`);
          return; // הודעה לא נשלחת
        }*/
          const response = NetworkManager.handleRequest(method, url, data);
          callback(response);
      }, /*delay*/500);
  }
}

class NetworkManager {
  static handleRequest(method, url, data = null) {
      console.log(`📡 ${method} request to:`, url, "with data:", data);

      const loggedInUser = getCookie("loggedInUser");

      if (url === "/userDB") {
          if (method === "GET") return UserServer.getUsers();
          if (method === "POST") return UserServer.addUser(data);
          if (method === "DELETE") return UserServer.deleteUser(loggedInUser);
          if (method === "PUT") return UserServer.updateUser(loggedInUser, data);
      }

      if (url === "/taskDB") {
          if (method === "GET") return TaskServer.getAllTasks();
          if (method === "POST") return TaskServer.addTask(loggedInUser, data);
          //מחיקת או עדכון כל המשימות
          if (method === "DELETE"){
            TaskServer.getAllTasks().data.filter(task => task.user == getCookie("loggedInUser"))
            .forEach(task => {
              TaskServer.deleteTask(task.user,task.id);
            });
            return { status: HTTP_STATUS_CODES.OK, message: "all you're taskd been deleted" };
          } ;
          if (method === "PUT"){
            TaskServer.getAllTasks().data.filter(task => task.user == getCookie("loggedInUser"))
            .forEach(task => {
              TaskServer.updateTask(task.user,task.id, data);
            });
            return { status: HTTP_STATUS_CODES.OK, message: "all you're taskd been updated" };
          };
      }

      if (url.startsWith("/taskDB/")) {
          const taskId = Number(url.split("/taskDB/")[1]);

          if (method === "PUT") return TaskServer.updateTask(loggedInUser, taskId, data);
          if (method === "DELETE") return TaskServer.deleteTask(loggedInUser, taskId);
      }

      return { status: HTTP_STATUS_CODES.NOT_FOUND, error: "Not Found" };
  }
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
  }
  return null;
}




















/*class FXMLHttpRequest {

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

    
    //מחיקת המשתמש
    if(url === "/userDB/"){
      return data ? UserServer.updateUser(getCookie("loggedInUser"), data) : UserServer.deleteUser(getCookie("loggedInUser")) ;
    }


    //הוספת משימה (אם מקבלים מידע) או קבלת כל המשימות
    if (url === "/taskDB") {
      return data ? TaskServer.addTask(data.user, data) : TaskServer.getAllTasks() ;
    }
    

    if (url.startsWith("/taskDB/")) {
      
      const taskId = Number(url.split("/taskDB/")[1]);

      //מחיקת כל המשימות של המשתמש
      if(url === "/taskDB/"){
        
        if(data){
          let tasks = TaskServer.getAllTasks().data.filter(task => task.user == getCookie("loggedInUser"));
          tasks.forEach(task => {
            TaskServer.updateTask(task.user,task.id, data);
          });
          return { status: 200, message: "all you're taskd been updated" };
        };

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
}*/
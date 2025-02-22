//כל מה שבהערות זה אם נחנו רוצים להשתמש בקובץ DB

class TaskServer {
  /*constructor() {
    this.db = new Database("taskDB"); // ⬅️ יצירת מופע של `Database` עבור המשימות
  }*/

  static getAllTasks(){
    this.db = new Database("taskDB");
    return this.db.getAll();
  }

  static getTasks(username) {
    this.db = new Database("taskDB");
    return this.db.getAll.filter(task => task.user === username);
    /*const tasks = Database.getAll("taskDB");
    return tasks.filter(task => task.user === username);*/
  }

  static getTask(username, id) {
    this.db = new Database("taskDB");
    try {
            const task = this.db.getById(id);
            return task.user === username
                ? { status: 200, task }
                : { status: 403, error: "Not authorized to view this task" };
        } catch (error) {
            return { status: 404, error: error.message };
        }
    /*const task = Database.getById("taskDB", id);
    return task && task.user === username
        ? { status: 200, task }
        : { status: 404, error: "Task not found or not authorized" };*/
  }

  static addTask(username, task) {
    this.db = new Database("taskDB");
    task.user = username;
    task.id = new Date().getTime(); // ייצור ID ייחודי
    this.db.create(task);
    //Database.create("taskDB", task);
      
    return { status: 201, message: "Task added successfully" };
  }

  static updateTask(username, id, updatedTask) {
    this.db = new Database("taskDB");
    try {
            const task = this.db.getById(id);
            if (task.user !== username) {
                return { status: 403, error: "Not authorized to update this task" };
            }
            this.db.update(id, updatedTask);
            return { status: 200, message: "Task updated successfully" };
        } catch (error) {
            return { status: 404, error: error.message };
        }
    /*const task = Database.getById("taskDB", id);
    if (!task || task.user !== username) {
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = Database.update("taskDB", id, updatedTask);
    return success
        ? { status: 200, message: "Task updated successfully" }
        : { status: 500, error: "Failed to update task" };*/
  }

  static deleteTask(username, id) {
    this.db = new Database("taskDB");
     try {
            const task = this.db.getById(id);
            if (task.user !== username) {
                return { status: 403, error: "Not authorized to delete this task" };
            }
            this.db.delete(id);
            return { status: 200, message: "Task deleted successfully" };
        } catch (error) {
            return { status: 404, error: error.message };
        }
    /*const task = Database.getById("taskDB", id);
    
    if (!task || task.user !== username) {
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = Database.delete("taskDB", id);
    return success
        ? { status: 200, message: "Task deleted successfully" }
        : { status: 500, error: "Failed to delete task" };*/
  }
}

// יצירת מופע של TaskServer (כדי שהבקשות יעברו דרכו)
//const taskServer = new TaskServer();
class TaskServer {

  static db = new Database("taskDB");
  
  //קבלת כל המשימות
  static getAllTasks(){
    return { status: 200, data: this.db.getAll() };
  }

  //הוספת משימה
  static addTask(username, task) {
    task.user = username;
    task.id = new Date().getTime(); // ייצור ID ייחודי
    
    this.db.create(task);
      
    return { status: 201, message: "Task added successfully" };
  }

  //עדכון משימה
  static updateTask(username, id, updatedTask) {
    try {
            const task = this.db.getById(id);
            console.log(task)
            if (task.user !== username) {
                return { status: 403, error: "Not authorized to update this task" };
            }
            this.db.updateTask(id, updatedTask);
            return { status: 200, message: "Task updated successfully" };
        } catch (error) {
            return { status: 404, error: error.message };
        }
  }

  //מחיקת משימה
  static deleteTask(username, id) {
     try {
            const task = this.db.getById(id);
            if (task.user !== username) {
                return { status: 403, error: "Not authorized to delete this task" };
            }
            this.db.deleteTask(id);
            return { status: 200, message: "Task deleted successfully" };
          } catch (error) {
              return { status: 404, error: error.message };
          }
  }
}
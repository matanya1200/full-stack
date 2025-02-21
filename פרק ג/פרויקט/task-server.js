class TaskServer {
  static getTasks(username) {
    const tasks = Database.getAll("taskDB");
    return tasks.filter(task => task.user === username);
  }

  static getTask(username, id) {
    const task = Database.getById("taskDB", id);
    return task && task.user === username
        ? { status: 200, task }
        : { status: 404, error: "Task not found or not authorized" };
    }

  static addTask(username, task) {
    task.user = username;
    task.id = new Date().getTime(); // ייצור ID ייחודי
    Database.create("taskDB", task);
      
    return { status: 201, message: "Task added successfully" };
  }

  static updateTask(username, id, updatedTask) {
    const task = Database.getById("taskDB", id);
    if (!task || task.user !== username) {
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = Database.update("taskDB", id, updatedTask);
    return success
        ? { status: 200, message: "Task updated successfully" }
        : { status: 500, error: "Failed to update task" };
  }

  static deleteTask(username, id) {
    const task = Database.getById("taskDB", id);
    
    if (!task || task.user !== username) {
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = Database.delete("taskDB", id);
    return success
        ? { status: 200, message: "Task deleted successfully" }
        : { status: 500, error: "Failed to delete task" };
  }
}
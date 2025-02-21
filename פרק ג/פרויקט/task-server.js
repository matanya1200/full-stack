class TaskServer {
  static getTasks(username) {
    const tasksDB = new Database("taskDB");
    const tasks = tasksDB.getAll();
    return tasks.filter((task) => task.user === username);
  }

  static getTask(username, id) {
    const tasksDB = new Database("taskDB");
    const task = tasksDB.getById(id);
    return task && task.user === username
      ? { status: 200, task }
      : { status: 404, error: "Task not found or not authorized" };
  }

  static addTask(username, task) {
    const tasksDB = new Database("taskDB");
    console.log("📌 Adding task:", task); // 🔍 בדיקה
    let tasks = tasksDB.getAll();
    console.log("📋 Tasks before adding:", tasks);

    task.user = username;
    task.id = new Date().getTime(); // ייצור ID ייחודי

    tasksDB.create(task);
    console.log("📋 Tasks after adding:", tasksDB.getAll());

    return { status: 201, message: "Task added successfully" };
  }

  static updateTask(username, id, updatedTask) {
    const tasksDB = new Database("taskDB");
    const task = tasksDB.getById(id);
    if (!task || task.user !== username) {
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = tasksDB.update(id, updatedTask);
    return success
      ? { status: 200, message: "Task updated successfully" }
      : { status: 500, error: "Failed to update task" };
  }

  static deleteTask(username, id) {
    const tasksDB = new Database("taskDB");
    const task = tasksDB.getById(id);
    console.log("🗑 Checking task for deletion:", task);

    if (!task || task.user !== username) {
      console.log("❌ Task not found or not authorized:", id);
      return { status: 404, error: "Task not found or not authorized" };
    }

    const success = tasksDB.delete(id);
    return success
      ? { status: 200, message: "Task deleted successfully" }
      : { status: 500, error: "Failed to delete task" };
  }
}

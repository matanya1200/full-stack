//כל מה שבהערות זה אם נחנו רוצים להשתמש בקובץ DB

class TaskServer {
  tasksDB = new Database("taskDB");

  // ----- private methods -----

  static #getTasks(userId, search = "") {
    if (!userId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID is required",
      };
    }

    return tasksDB.getAll({
      conctor: "and",
      filters: [
        { field: "user", operator: "equals", value: userId },
        { field: "description", operator: "contains", value: search },
      ],
    });
  }

  static #getTask(userId, taskId) {
    if (!userId || !taskId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and Task ID are required",
      };
    }

    const tasks = tasksDB.getAll({
      conctor: "and",
      filters: [
        { field: "id", operator: "equals", value: taskId },
        { field: "user", operator: "equals", value: userId },
      ],
    });

    if (!tasks.length) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "Task not found",
      };
    }

    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Task found",
      data: tasks[0],
    };
  }

  static #addTask(userId, task) {
    if (!userId || !task?.description) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and task are required",
      };
    }

    task.user = userId;
    const id = new Date().getTime(); // timestamp as unique ID
    task.id = id.toString();
    tasksDB.create(task);

    return {
      status: HTTP_STATUS_CODES.CREATED,
      message: "Task added successfully",
      data: task,
    };
  }

  static #updateTask(userId, taskId, updatedTask) {
    if (!userId || !taskId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and Task ID are required",
      };
    }

    try {
      const task = tasksDB.getById(taskId);
      if (task.user !== userId) {
        throw new Error("Task not authorized");
      }
    } catch (error) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: error.message,
      };
    }

    tasksDB.update(taskId, updatedTask);
    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Task updated successfully",
      data: updatedTask,
    };
  }

  static #deleteTask(userId, taskId) {
    if (!userId || !taskId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and Task ID are required",
      };
    }

    try {
      const task = tasksDB.getById(taskId);
      if (task.user !== userId) {
        throw new Error("Task not authorized");
      }
    } catch (error) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: error.message,
      };
    }

    tasksDB.delete(taskId);
    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Task deleted successfully",
    };
  }

  // ----- public methods -----

  static controller(method, url, data) {
    const taskId = url.split("/")[1];

    switch (method) {
      case HTTP_METHODS.GET:
        if (taskId) {
          return this.#getTask(data.user, taskId);
        }
        return this.#getTasks(data.user, data.search);

      case HTTP_METHODS.POST:
        return this.#addTask(data.user, data);

      case HTTP_METHODS.PUT:
        return this.#updateTask(data.user, taskId, data);

      case HTTP_METHODS.DELETE:
        return this.#deleteTask(data.user, taskId);

      default:
        return {
          status: HTTP_STATUS_CODES.NOT_FOUND,
          error: "Route Not Found",
        };
    }
  }
}

// יצירת מופע של TaskServer (כדי שהבקשות יעברו דרכו)
//const taskServer = new TaskServer();

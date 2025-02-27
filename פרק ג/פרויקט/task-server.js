class TaskServer {
  static #tasksDB = new Database("taskDB");

  // ----- private methods -----

  static #getTasks(userId, search = "") {
    if (!userId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID is required",
      };
    }

    const filters = [{ field: "user", operator: "equals", value: userId }];
    if (search) {
      filters.push({ field: "title", operator: "contains", value: search });
    }

    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Tasks found",
      data: this.#tasksDB.getAll({
        conctor: "and",
        filters,
      }),
    };
  }

  static #getTask(userId, taskId) {
    if (!userId || !taskId) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and Task ID are required",
      };
    }

    const tasks = this.#tasksDB.getAll({
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
    if (!userId || !task?.title) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User ID and task are required",
      };
    }

    task.user = userId;
    const id = new Date().getTime(); // timestamp as unique ID
    task.id = id.toString();
    this.#tasksDB.create(task);

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
      const task = this.#tasksDB.getById(taskId);
      if (task.user !== userId) {
        throw new Error("Task not authorized");
      }
    } catch (error) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: error.message,
      };
    }

    this.#tasksDB.update(taskId, updatedTask);
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
      const task = this.#tasksDB.getById(taskId);
      if (task.user !== userId) {
        throw new Error("Task not authorized");
      }
    } catch (error) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: error.message,
      };
    }

    this.#tasksDB.delete(taskId);
    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Task deleted successfully",
    };
  }

  // ----- public methods -----

  static controller(method, url, data) {
    const taskId = url.split("/")[0];

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

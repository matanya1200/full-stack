class TaskServer {
    static getTasks(username) {
        const tasks = Database.getAll("taskDB");
        return tasks.filter(task => task.user === username);
    }

    static getTask(username, id) {
        const tasks = TaskServer.getTasks(username);
        const task = tasks.find(t => t.id === id);
        return task ? { status: 200, task } : { status: 404, error: "Task not found" };
    }

    static addTask(username, task) {
        
        console.log("📌 Adding task:", task); // 🔍 בדיקה
        let tasks = Database.getAll("taskDB");
        console.log("📋 Tasks before adding:", tasks);

        task.user = username;
        task.id = new Date().getTime(); // ייצור ID ייחודי
        
        Database.create("taskDB", task);
        console.log("📋 Tasks after adding:", Database.getAll("taskDB"));
        
        return { status: 201, message: "Task added successfully" };
    }

    static updateTask(username, id, updatedTask) {
        let tasks = Database.getAll("taskDB");

        id = Number(id);

        console.log("🔍 Searching for task ID:", id); // 🔍 בדיקה

        const index = tasks.findIndex(task => task.id == id);

        if (index === -1 || tasks[index].user !== username) {
            console.log("❌ Task not found or user mismatch:", id);
            return { status: 404, error: "Task not found" };
        }

        console.log("🔄 Before update:", tasks[index]);

        tasks[index] = {
            ...tasks[index],
            description: updatedTask.description ?? tasks[index].description,
            finished: updatedTask.finished ?? tasks[index].finished
        };
        
        Database.saveDB("taskDB", tasks);
        console.log("✅ After update:", tasks[index]);

        return { status: 200, message: "Task updated successfully" };
    }

    static deleteTask(username, id) {
        const task = this.getTask(username, id);
        if (!task) return { status: 404, error: "Task not found" };
        Database.delete("taskDB", id);
        return { status: 200, message: "Task deleted successfully" };
    }
}

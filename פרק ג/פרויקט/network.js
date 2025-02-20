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
            
            const users = Database.getAll("userDB");
            console.log("📤 Returning users from DB:", users); // בדיקה מה מוחזר בפועל
            return { status: 200, data: Array.isArray(users) ? users : [] }; // וידוא החזרת מערך
        }

        if (url.startsWith("/taskDB/")) {
            const taskId = Number(url.split("/taskDB/")[1]); // חילוץ ה-ID כ-Number
            console.log("📩 Updating Task ID:", taskId, "With Data:", data); // 🔍 בדיקה

            return TaskServer.updateTask(data.user, taskId, data);
        }

        if (url.startsWith("/taskDB")) {
            return data ? TaskServer.addTask(data.user, data) : { status: 200, data: Database.getAll("taskDB") };
        }

        return { status: 404, error: "Not Found" };
    }
    
}

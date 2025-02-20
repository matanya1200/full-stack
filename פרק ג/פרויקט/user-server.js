class UserServer {
    static registerUser(user) {
        let users = Database.getAll("userDB");
        console.log("🔹 Users before registration:", users);

        if (!Array.isArray(users)) {
            users = []; // ודא שזה מערך
        }

        if (users.find(u => u.username === user.username || u.email === user.email)) {
            console.log("🚨 User already exists!");
            return { status: 400, error: "User already exists" };
        }

        Database.create("userDB", user);

        console.log("✅ User added successfully:", user);
        console.log("🔹 Users after registration:", Database.getAll("userDB"));
        
        return { status: 201, message: "User registered successfully" };
    }

    static loginUser(username, password) {
        const users = Database.getAll("userDB");
        const user = users.find(u => u.username === username && u.password === password);
        return user ? { status: 200, message: "Login successful", user } : { status: 401, error: "Invalid credentials" };
    }
}

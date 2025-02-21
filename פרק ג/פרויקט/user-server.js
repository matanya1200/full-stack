class UserServer {
  static registerUser(user) {
    const users = Database.getAll("userDB");
    if (users.find(u => u.username === user.username || u.email === user.email)) {
        return { status: 400, error: "User already exists" };
    }
    Database.create("userDB", user);
    return { status: 201, message: "User registered successfully" };
  }

  static loginUser(username, password) {
    const users = Database.getAll("userDB");
    const user = users.find(u => u.username === username && u.password === password);
    return user ? { status: 200, message: "Login successful", user } : { status: 401, error: "Invalid credentials" };
  }
}
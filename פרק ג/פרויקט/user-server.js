class UserServer {
  // TODO: add id
  static registerUser(user) {
    const usersDb = new Database("userDB");
    const users = usersDb.getAll();
    if (
      users.find((u) => u.username === user.username || u.email === user.email)
    ) {
      return { status: 400, error: "User already exists" };
    }
    usersDb.create(user);
    return { status: 201, message: "User registered successfully" };
  }

  static loginUser(username, password) {
    const usersDb = new Database("userDB");
    const users = usersDb.getAll();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user
      ? { status: 200, message: "Login successful", user }
      : { status: 401, error: "Invalid credentials" };
  }
}

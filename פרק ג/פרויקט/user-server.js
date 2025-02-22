//כל מה שבהערות זה אם נחנו רוצים להשתמש בקובץ DB

class UserServer {
  /*constructor() {
        this.db = new Database("userDB"); // ⬅️ יצירת מופע של `Database` עבור המשתמשים
  }*/

  static registerUser(user) {
    this.db = new Database("userDB");
    const users = this.db.getAll();
    //const users = Database.getAll("userDB");
    if (users.find(u => u.username === user.username || u.email === user.email)) {
        return { status: 400, error: "User already exists" };
    }
    this.db.create(user)
    //Database.create("userDB", user);
    return { status: 201, message: "User registered successfully" };
  }

  static loginUser(username, password) {
    this.db = new Database("userDB");
    const users = this.db.getAll()
    //const users = Database.getAll("userDB");
    const user = users.find(u => u.username === username && u.password === password);
    return user ? { status: 200, message: "Login successful", user } : { status: 401, error: "Invalid credentials" };
  }

  static getUsers(){
    this.db = new Database("userDB");
    return this.db.getAll();
  }
}

// יצירת מופע של UserServer
//const userServer = new UserServer();
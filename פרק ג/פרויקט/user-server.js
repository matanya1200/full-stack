class UserServer {

  //קבלת כל המשתמשים
  static getUsers(){
    this.db = new Database("userDB");
    return { status: 200, data: this.db.getAll() }
  }

  //הוספת משתמש
  static addUser(user) {
    this.db = new Database("userDB");
    const users = this.db.getAll();
    if (users.find(u => u.id === user.id || u.email === user.email)) {
        return { status: 400, error: "User already exists" };
    }
    this.db.create(user)
    return { status: 201, message: "User registered successfully" };
  }

  //מחיקת משתמש
  static deleteUser(id){
    this.db = new Database("userDB");
    this.db.delete(id);
    return { status: 200, message: "User deleted successfully" };
  }
}
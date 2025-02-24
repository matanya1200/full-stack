class UserServer {

  static db = new Database("userDB");

  //קבלת כל המשתמשים
  static getUsers(){
    return { status: 200, data: this.db.getAll() }
  }

  //הוספת משתמש
  static addUser(user) {
    const users = this.db.getAll();
    if (users.find(u => u.id === user.id || u.email === user.email)) {
        return { status: 400, error: "User already exists" };
    }
    this.db.create(user)
    return { status: 201, message: "User registered successfully" };
  }

  //מחיקת משתמש
  static deleteUser(id){
    this.db.delete(id);
    return { status: 200, message: "User deleted successfully" };
  }
}
class UserServer {

  static db = new Database("userDB");

  //קבלת כל המשתמשים
  static getUsers(){
    return { status: HTTP_STATUS_CODES.OK, data: this.db.getAll() }
  }

  //הוספת משתמש
  static addUser(user) {
    const users = this.db.getAll();
    if (users.find(u => u.user === user.user || u.email === user.email)) {
        return { status: HTTP_STATUS_CODES.BAD_REQUEST, error: "User already exists" };
    }
    this.db.create(user)
    return { status: HTTP_STATUS_CODES.CREATED, message: "User registered successfully" };
  }

  //מחיקת משתמש
  static deleteUser(id){
    this.db.deleteUser(id);
    return { status: HTTP_STATUS_CODES.OK, message: "User deleted successfully" };
  }

  //עדכון משתמש
  static updateUser(id, newId){
    this.db.updateUser(id, newId);
    return { status: HTTP_STATUS_CODES.OK, message: "User deleted successfully" };
  }
}
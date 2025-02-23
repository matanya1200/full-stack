//כל מה שבהערות זה אם נחנו רוצים להשתמש בקובץ DB

class UserServer {
  static #usersDb = new Database("userDB");

  // ----- private methods -----

  static #getById(id) {
    try {
      return {
        status: HTTP_STATUS_CODES.OK,
        message: "User found",
        data: this.#usersDb.getById(id),
      };
    } catch (error) {
      return {
        status: HTTP_STATUS_CODES.NOT_FOUND,
        error: error.message,
      };
    }
  }

  static #registerUser(user) {
    if (!user.username || !user.email || !user.password) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "Missing required fields",
      };
    }

    const users = this.#usersDb.getAll({
      conector: "or",
      filters: [
        { field: "username", operator: "equals", value: user.username },
        { field: "email", operator: "equals", value: user.email },
      ],
    });

    if (users.length) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "User already exists",
      };
    }

    const id = new Date().getTime(); // timestamp as unique ID
    this.#usersDb.create({ id: id.toString(), ...user });
    return {
      status: HTTP_STATUS_CODES.CREATED,
      message: "User registered successfully",
    };
  }

  static #loginUser(username, password) {
    if (!username || !password) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "Missing required fields",
      };
    }

    const users = this.#usersDb.getAll({
      conector: "and",
      filters: [
        { field: "username", operator: "equals", value: username },
        { field: "password", operator: "equals", value: password },
      ],
    });

    if (!users.length) {
      return {
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        error: "Invalid credentials",
      };
    }

    return {
      status: HTTP_STATUS_CODES.OK,
      message: "Login successful",
      data: users[0],
    };
  }

  // ----- public methods -----

  static controller(method, url, data) {
    const userId = url.split("/")[0];

    switch (method) {
      case HTTP_METHODS.GET:
        if (userId) {
          return this.#getById(userId);
        }
      case HTTP_METHODS.POST:
        if (url === "registration") {
          return this.#registerUser(data);
        }
        if (url === "login") {
          return this.#loginUser(data.username, data.password);
        }

      default:
        return {
          status: HTTP_STATUS_CODES.NOT_FOUND,
          error: "Route Not Found",
        };
    }
  }
}

// יצירת מופע של UserServer
//const userServer = new UserServer();

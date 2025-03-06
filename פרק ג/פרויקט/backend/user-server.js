class UserServer {
  static #usersDb = new Database("userDB");

  // ----- private methods -----

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

  static #loginUser(user) {
    if (!user.username || !user.password) {
      return {
        status: HTTP_STATUS_CODES.BAD_REQUEST,
        error: "Missing required fields",
      };
    }

    const users = this.#usersDb.getAll({
      conector: "and",
      filters: [
        { field: "username", operator: "equals", value: user.username },
        { field: "password", operator: "equals", value: user.password },
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
      data: JSON.stringify(users[0]),
    };
  }

  // ----- public methods -----

  static controller(method, url, data) {
    data = JSON.parse(data);

    switch (method) {
      case HTTP_METHODS.POST:
        if (url === "registration") {
          return this.#registerUser(data);
        } else if (url === "login") {
          return this.#loginUser(data);
        }

      default:
        return {
          status: HTTP_STATUS_CODES.NOT_FOUND,
          error: "Route Not Found",
        };
    }
  }
}

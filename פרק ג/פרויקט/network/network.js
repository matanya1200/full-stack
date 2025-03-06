class Network {
  static #randomDelay() {
    return Math.floor(Math.random() * 3000) + 1000;
  }

  static #randomOmit() {
    return Math.random() < Math.random() * 0.4 + 0.1;
  }

  static mockRequest(method, url, data = {}, callback) {
    const randomDelay = this.#randomDelay();
    const randomOmit = false; // this.#randomOmit();

    console.log(`[Network] ${method} ${url} (delay: ${randomDelay}ms)`);
    console.log(data);
    console.log("omit:", randomOmit);

    const [_blank, resource, ...rest] = url.split("/");
    let response = "";

    if (!randomOmit) {
      if (resource === "users") {
        response = UserServer.controller(method, rest.join("/"), data);
      } else if (resource === "tasks") {
        response = TaskServer.controller(method, rest.join("/"), data);
      } else {
        response = {
          status: HTTP_STATUS_CODES.NOT_FOUND,
          error: "Not Found",
        };
      }
    }

    setTimeout(() => {
      callback(response);
    }, randomDelay);
  }
}

class FXMLHttpRequest {
  static get(url, callback) {
    setTimeout(() => {
      const response = this.#mockRequest(HTTP_METHODS.GET, url);
      callback(response);
    }, 500);
  }

  static post(url, data, callback) {
    setTimeout(() => {
      const response = this.#mockRequest(HTTP_METHODS.POST, url, data);
      callback(response);
    }, 500);
  }

  static put(url, data, callback) {
    setTimeout(() => {
      const response = this.#mockRequest(HTTP_METHODS.PUT, url, data);
      callback(response);
    }, 500);
  }

  static delete(url, callback) {
    setTimeout(() => {
      const response = this.#mockRequest(HTTP_METHODS.DELETE, url);
      callback(response);
    }, 500);
  }

  static #mockRequest(method, url, data = null) {
    const [_blank, resource, ...rest] = url.split("/");

    if (resource === "userDB") {
      return UserServer.controller(method, rest.join("/"), data);
    }

    if (resource === "taskDB") {
      data.user = localStorage.getItem("loggedInUser");
      return TaskServer.controller(method, rest.join("/"), data);
    }

    return { status: HTTP_STATUS_CODES.NOT_FOUND, error: "Not Found" };
  }
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

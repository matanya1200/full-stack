class FXMLHttpRequest {
  onload = () => {};
  onerror = () => {};
  responseText = null;
  status = null;

  open(method, url) {
    this.method = method;
    this.url = url;
  }

  send(data) {
    Network.mockRequest(this.method, this.url, data, (res) => {
      if (!res) {
        this.onerror();
      } else {
        this.status = res.status;
        this.responseText = res.data || res.message || res.error;
        this.onload();
      }
    });
  }
}

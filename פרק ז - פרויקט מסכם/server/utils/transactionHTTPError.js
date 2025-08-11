class transactionHTTPError extends Error {
    constructor(statusCode, message, data = {}) {
        super(message);

        this.name = "transactionHTTPError";
        this.statusCode = statusCode;
        this.data = data;
    }
}

module.exports = transactionHTTPError;
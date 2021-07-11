class APIError extends Error {
    constructor(message, code, method, path, body) {
        super(message);
        /**
         * HTTP error code returned from the request
         * @type {number}
         */
        this.code = code ?? 500;

        /**
         * The HTTP method used for the request
         * @type {string}
         */
        this.method = method;

        /**
         * The path of the request relative to the HTTP endpoint
         * @type {string}
         */
        this.path = path;

        /**
         * The body of the request
         * @type {string}
         */
        this.body = body;
    }
}

module.exports = APIError;
class APIError extends Error {
    /**
     * Specific error for cardinal API requests.
     * @param {string} message The message of the error.
     * @param {number} code The http result code of the request.
     * @param {string} method The method of the request.
     * @param {string} path The path of the request.
     * @param {string} body The body of the request.
     */
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
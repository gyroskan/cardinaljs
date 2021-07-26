const { APIPATH } = require('./api_config.json');
const fetch = require('node-fetch');
const APIError = require('./apiError');

class Api {
    /**
     * Create an instance used to make request to cardinal API.
     * @param {string} token - The token used to connect to cardinal API.
     * @param {string} [apiurl=APIPATH] - The url to cardinal API (default is last version).
     * @param {number} [maxAttempt=3] - The max attempt to connect to the API.
     */
    constructor(token, apiurl = APIPATH, maxAttempt = 3) {
        /**
         * The token used for cardinal API.
         * @type {?string}
         * @private
         */
        this.token = token;

        /**
         * The url of the API.
         * @type {string}
         */
        this.apiurl = apiurl;

        /**
         * The header used for all requests.
         * @private
         */
        this.header = undefined;

        /**
         * The max number of attempt to connect to the API before throwing an error.
         * @type {number}
         * @private
         */
        this.maxAttempt = maxAttempt;
    }

    /**
     * Test the token to use cardinal API.
     * @description Ensure that the token is valid and the API reachable.
     * @returns {Promise<string>} - Return the token used to connect.
     */
    async connect() {
        let attempt = 0;
        let e;
        do {
            console.log('Connecting to cardinal API...');
            try {
                attempt++;
                const user = await this.request('/users/me');
                console.log(`Connected to cardinal API as ${user.username}`);
                return this.token;
            }
            catch (err) {
                console.error(err);
                e = err;
                if (err instanceof APIError) {
                    if (err.code >= 500) {
                        console.log('Error connecting to cardinal API, server error.');
                    } else if (err.code == 403 || err.code == 401) {
                        console.log('Cannot connect to cardinal API, invalid token.');
                    } else {
                        console.log('Unable to connect to cardinal API.');
                    }
                }
                else {
                    console.log('Network Error.');
                }
                console.log('Retrying to connect to cardinal API...');
            }
        } while (attempt < this.maxAttempt);

        console.log('Max attempt of connection to cardinal API reached.');
        throw e;
    }

    /**
     * Request the cardinal API.
     * @param {string} path - The path after the base api url.
     * @param {string} method - The method (GET|POST|PATCH|DELETE).
     * @param {object} [object=null] - The body of the request.
     * @returns {Promise<object>} - The object fetched.
     */
    async request(path, method, object = null) {
        const body = JSON.stringify(object);
        return new Promise((resolve, reject) => {
            const t = fetch(`${this.apiurl}${path}`, {
                method: method,
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
                body: body,
            });
            t.then(res => {
                if (res.ok) {
                    if (res.headers.get('content-type').startsWith('application/json')) {
                        res.json()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    } else {
                        res.buffer()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    }
                }
                else {
                    return reject(new APIError(res.statusText, res.status, method, `${this.apiurl}${path}`, body));
                }
            }).catch(err => {
                console.error(`Request cardinal API error:\n${err}`);
                reject(err);
            });
        });
    }
}

module.exports = Api;
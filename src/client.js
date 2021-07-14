const Api = require('./api');
const GuildManager = require('./guildManager');

class Client {
    /**
     * Create a new client to interact with cardinal API.
     * @param {string} token The token used to connect to Cardinal API.
     */
    constructor(token = '') {
        /**
         * The token used for cardinal API.
         * @type {?string}
         */
        this.token = token;

        /**
         * The object used to fetch the api.
         * @type {Api}
         */
        this.api = undefined;

        /**
         * The guild manager of this client.
         * @type {GuildManager}
         */
        this.guilds = new GuildManager(this);
    }

    /**
     * Log the client to the API.
     * @param {string} [token=this.token] Token of the user to log in.
     * @returns {Promise<string>} Returns a promise with the token used to connect.
     */
    async login(token = this.token) {
        this.token = token;
        this.api = new Api(token);
        await this.api.connect();
        return this.token;
    }
}

module.exports = Client;
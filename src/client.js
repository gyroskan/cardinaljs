const Api = require('./api');
const GuildManager = require('./guildManager');

class Client {
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
     * @returns {string} Token of the user.
     */
    async login(token = this.token) {
        this.token = token;
        this.api = new Api(token);
        // eslint-disable-next-line no-useless-catch
        try {
            await this.api.connect();
            return this.token;
        }
        catch (e) {
            throw e;
        }
    }
}

module.exports = Client;
const Client = require("./client");
const Guild = require("./guild");

class GuildManager {
    /**
     * Create a new GuildManager.
     * @param {Client} client The client to connect to the API.
     */
    constructor(client) {
        /**
         * The client to connect to the API.
         * @type {Client}
         */
        this.client = client;

        /**
         * The map containing all tracked guilds.
         * @type {Map<string, Guild>}
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the guild if it is in the database.
     * @param {string} id Id of the guild.
     */
    async resolve(id) {
        let guild = this.cache.get(id);
        if (guild !== undefined) {
            return guild;
        }

        guild = await this.client.api.request(`/guilds/${id}`, 'GET');
        if (guild) {
            this.cache.set(guild.guildID, guild);
        }
        return guild;
    }
}

module.exports = GuildManager;
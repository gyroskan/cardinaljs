/* eslint-disable */
const APIError = require("./apiError");
const Client = require("./client");
const Guild = require("./guild");
/* eslint-enable */

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

        try {
            const res = await this.client.api.request(`/guilds/${id}`, 'GET');
            guild = new Guild(res, this.client);
            this.cache.set(guild.guildID, guild);
            return guild;
        }
        catch (err) {
            if (!(err instanceof APIError) || err.code != 404) {
                console.error(err);
            }
            return undefined;
        }
    }

    /**
     * Create a new guild.
     * @param {Object} guild
     * @param {string} guild.guildName
     * @param {?Snowflake} guild.reportChannel
     * @param {?Snowflake} guild.welcomeChannel
     * @param {?string} guild.welcomeMsg
     * @param {?string} guild.privateWelcomeMsg
     * @param {?Snowflake} guild.lvlChannel
     * @param {?number} guild.lvlReplace
     * @param {?number} guild.lvlResponse
     * @param {?string} guild.disabledCommands
     * @param {?boolean} guild.allowModeration
     * @param {?number} guild.maxWarns
     * @param {?number} guild.banTime
     */
    create(guild) {
        const g = new Guild(guild, this.client);
        return new Promise((resolve, reject) => {
            this.client.api.request('/guilds/', 'POST', g)
                .then(resp => {
                    Object.assign(g, resp);
                    this.cache.set(g.id, g);
                    resolve(g);
                })
                .catch(reject);
        });
    }
}

module.exports = GuildManager;
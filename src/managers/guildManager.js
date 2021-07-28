/* eslint-disable */
const APIError = require("../api/apiError");
const Client = require("../structures/client");
const Guild = require("../structures/guild");
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
         * @readonly
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the guild if it is in the database.
     * @param {string} id Id of the guild.
     * @returns {Promise<Guild>} The resolved guild.
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
     * @param {Object} guild The guild object.
     * @param {Snowflake} guild.guildID The ID of this guild.
     * @param {string} guild.guildName The name of this guild.
     * @param {string} [guild.prefix] The prefix used for the discord bot.
     * @param {Snowflake} [guild.reportChannel] The channel used to send reports.
     * @param {Snowflake} [guild.welcomeChannel] The channel used to send welcome messages.
     * @param {string} [guild.welcomeMsg] The message send to new members.
     * @param {string} [guild.privateWelcomeMsg] The message send in DM to new members.
     * @param {Snowflake} [guild.lvlChannel] The channel where lvl up messages are sent.
     * @param {number} [guild.lvlReplace] Wether rewards are replaced on lvl up or not.
     * @param {number} [guild.lvlResponse] On which lvl does the bot send a lvl up message. (0 means never).
     * @param {string} [guild.disabledCommands] The list of names of disabled commands.
     * @param {boolean} [guild.allowModeration] Whether moderation commands are allowed or not.
     * @param {number} [guild.maxWarns] The number of warns before a member get banned. (0 means never get banned from warns).
     * @param {number} [guild.banTime] The number of days a ban last. (between 0 and 7).
     * @returns {Promise<Guild>} The created guild.
     */
    create(guild) {
        const g = new Guild(guild, this.client);
        // eslint-disable-next-line
        const { members, client, channels, roles, ...obj } = g;
        return new Promise((resolve, reject) => {
            this.client.api.request('/guilds/', 'POST', obj)
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
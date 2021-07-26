/* eslint-disable */
const Guild = require('../structures/guild');
const Client = require('../structures/client');
const Channel = require('../structures/channel');
const APIError = require('../api/apiError');
/* eslint-enable */

class ChannelManager {
    /**
     * Create a new ChannelManager for the guild.
     * @param {Client} client The client to connect to the API.
     * @param {Guild} guild The guild of the members.
     */
    constructor(client, guild) {
        /**
         * The client to connect to the API.
         * @type {Client}
         */
        this.client = client;

        /**
         * The id of the guild the channels are part of.
         * @type {Snowflake}
         */
        this.guildID = guild.guildID;

        /**
         * The guild the channels are part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The map containing all tracked channels.
         * @type {Map<string, Channel>}
         * @readonly
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the channel if it is in the database.
     * @param {string} id Id of the channel.
     * @returns {Promise<Channel | undefined>} The resolved channel.
     */
    async resolve(id) {
        let channel = this.cache.get(id);
        if (channel !== undefined) {
            return channel;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.guildID}/channels/${id}`, 'GET');
            channel = new Channel(res, this.guild, this.client);
            this.cache.set(channel.channelID, channel);
            return channel;
        }
        catch (err) {
            if (!(err instanceof APIError) || err.code != 404) {
                console.error(err);
            }
            return undefined;
        }
    }

    /**
     * Create a new member for this guild.
     * @param {Object} channel The channel from the API.
     * @param {Snowflake} channel.channelID The ID of the channel.
     * @param {number} [channel.ignored] Wether the channel must be ignored.
     * @param {number} [channel.xpBlacklisted] Wether to disable xp in this channel.
     * @returns {Promise<Channel>} The channel if it was created.
     */
    create(channel) {
        const ch = new Channel(channel, this.guild, this.client);
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/channels/`, 'POST', ch)
                .then(resp => {
                    Object.assign(ch, resp);
                    this.cache.set(ch.channelID, ch);
                    resolve(ch);
                })
                .catch(reject);
        });
    }
}

module.exports = ChannelManager;
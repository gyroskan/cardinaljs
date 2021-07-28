/* eslint-disable */
const Guild = require('./guild');
const Client = require('./client');
/* eslint-enable */

class Channel {
    /**
     * Create a new channel.
     * @param {Object} channel The channel object.
     * @param {Snowflake} channel.channelID The channel id.
     * @param {boolean} [channel.ignored] Wether the channel must be ignored.
     * @param {boolean} [channel.xpBlacklisted] Wether to disable xp in this channel.
     * @param {Guild} guild The guild this channel is part of.
     * @param {Client} client The client used to connect to the API.
     * @returns The created channel.
     */
    constructor(channel, guild, client) {
        /**
         * The client used to connect to the API.
         * @type {Client}
         */
        this.client = client;
        if (!client)
            return undefined;

        /**
         * The guild this channel is part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The id of the channel.
         * @type {Snowflake}
         */
        this.channelID = channel.channelID;

        /**
         * The id of the guild this channel is part of.
         * @type {Snowflake}
         */
        this.guildID = guild.guildID;

        /**
         * Wether cardinal bot ignore this channel or not.
         * @type {boolean}
         */
        this.ignored = channel.ignored ? channel.ignored : false;

        /**
         * Wether members of this channel are blocked from xp leveling or not.
         * @type {boolean}
         */
        this.xpBlacklisted = channel.xpBlacklisted ? channel.xpBlacklisted : false;
    }

    /**
    * The ID of this channel.
    * @type {Snowflake}
    */
    get id() {
        return this.channelID;
    }

    /**
     * Updates the guild with new values.
     * @param {Object} data The patch values object.
     * @param {boolean} [data.ignored] Wether the channel must be ignored.
     * @param {boolean} [data.xpBlacklisted] Wether to disable xp in this channel.
     * @returns {Promise<Channel>} The edited channel object.
     */
    edit(data) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/channels/${this.channelID}`, 'PATCH', data)
                .then(channel => {
                    Object.assign(this, channel);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Delete the channel.
     * @returns {Promise<boolean>} Whether it was deleted or not.
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/channels/${this.channelID}`, 'DELETE')
                .then(() => resolve(this.guild.channels.cache.delete(this.memberID)))
                .catch(err => reject(err));
        });
    }
}

module.exports = Channel;
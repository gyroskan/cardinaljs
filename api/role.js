/* eslint-disable */
const Guild = require('./guild');
const Client = require('./client');
/* eslint-enable */

class Role {
    /**
     * 
     * @param {Object} role
     * @param {Snowflake} role.roleID
     * @param {?boolean} role.isDefault
     * @param {?number} role.reward
     * @param {?boolean} role.ignored
     * @param {?boolean} role.xpBlacklisted
     * @param {Guild} guild The guild this role is part of.
     * @param {Client} client The client used to connect to the API.
     * @returns 
     */
    constructor(role, guild, client) {
        /**
         * @type {Client}
         */
        this.client = client;
        if (!client)
            return undefined;

        /**
         * The guild this role is part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The id of the role.
         * @type {Snowflake}
         */
        this.roleID = role.roleID;

        /**
         * The id of the guild this role is part of.
         * @type {Snowflake}
         */
        this.guildID = guild.guildID;

        /**
         * Wether to give this role to new members or not.
         * @type {boolean}
         */
        this.isDefault = role.isDefault ? role.isDefault : false;

        /**
         * The level when this role is given as reward. (0 means never).
         * @type {number}
         */
        this.reward = role.reward ? role.reward : 0;

        /**
         * Wether cardinal bot ignore this role or not.
         * @type {boolean}
         */
        this.ignored = role.ignored ? role.ignored : false;

        /**
         * Wether members of this role are blocked from xp leveling or not.
         * @type {boolean}
         */
        this.xpBlacklisted = role.xpBlacklisted ? role.xpBlacklisted : false;
    }

    /**
    * The ID of this role
    * @type {Snowflake}
    * @readonly
    */
    get id() {
        return this.roleID;
    }

    /**
     * Updates the guild with new values.
     * @param data
     * @param data.isDefault
     * @param data.reward
     * @param data.ignored
     * @param data.xpBlacklisted
     */
    edit(data) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/roles/${this.roleID}`, 'PATCH', data)
                .then(role => {
                    Object.assign(this, role);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Delete the role.
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/roles/${this.roleID}`, 'DELETE')
                .then(() => resolve(this.guild.roles.cache.delete(this.memberID)))
                .catch(err => reject(err));
        });
    }
}

module.exports = Role;
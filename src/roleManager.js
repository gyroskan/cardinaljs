/* eslint-disable */
const Guild = require('./guild');
const Client = require('./client');
const Role = require('./role');
const APIError = require('./apiError');
/* eslint-enable */

class RoleManager {
    /**
     * Create a new RoleManager for the guild.
     * @param {Client} client The client to connect to the API.
     * @param {Guild} guild The guild of the roles.
     */
    constructor(client, guild) {
        /**
         * The client to connect to the API.
         * @type {Client}
         */
        this.client = client;

        /**
         * The id of the guild the roles are part of.
         * @type {Snowflake}
         */
        this.guildID = guild.guildID;

        /**
         * The guild the roles are part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The map containing all tracked roles.
         * @type {Map<string, Role>}
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the role if it is in the database.
     * @param {string} id Id of the role.
     * @returns {?Role} The resolved role.
     */
    async resolve(id) {
        let role = this.cache.get(id);
        if (role !== undefined) {
            return role;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.guildID}/roles/${id}`, 'GET');
            role = new Role(res, this.guild, this.client);
            this.cache.set(role.roleID, role);
            return role;
        }
        catch (err) {
            if (!(err instanceof APIError) || err.code != 404) {
                console.error(err);
            }
            return undefined;
        }
    }

    /**
     * Create a new role for this guild.
     * @param {Object} role The role from the API.
     * @param {Snowflake} role.roleID The ID of the role.
     * @param {?Date} role.isDefault Wether to give this role to new members or not.
     * @param {?number} role.reward The level when this role is given as reward. (0 means never).
     * @param {?number} role.ignored Wether cardinal bot ignore this role or not.
     * @param {?number} role.xpBlacklisted Wether members of this role are blocked from xp leveling or not.
     * @returns {Promise<Role, Error>} The role if it was created.
     */
    create(role) {
        const rl = new Role(role, this.guild, this.client);
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/roles/`, 'POST', rl)
                .then(resp => {
                    Object.assign(rl, resp);
                    this.cache.set(rl.roleID, rl);
                    resolve(rl);
                })
                .catch(reject);
        });
    }
}

module.exports = RoleManager;
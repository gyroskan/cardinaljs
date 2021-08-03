/* eslint-disable */
const Guild = require('../structures/guild');
const Client = require('../structures/client');
const Role = require('../structures/role');
const APIError = require('../api/apiError');
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
     * @returns {Promise<Role | undefined>} The resolved role.
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
     * @param {boolean} [role.isDefault] Wether to give this role to new members or not.
     * @param {number} [role.reward] The level when this role is given as reward. (0 means never).
     * @param {boolean} [role.ignored] Wether cardinal bot ignore this role or not.
     * @param {boolean} [role.xpBlacklisted] Wether members of this role are blocked from xp leveling or not.
     * @returns {Promise<Role>} The role if it was created.
     */
    create(role) {
        const rl = new Role(role, this.guild, this.client);
        // eslint-disable-next-line
        const { client, guild, ...obj } = rl;
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/roles/`, 'POST', obj)
                .then(resp => {
                    Object.assign(rl, resp);
                    this.cache.set(rl.roleID, rl);
                    resolve(rl);
                })
                .catch(reject);
        });
    }

    /**
     * Get all roles that are rewards for the specified level.
     * @param {number} lvl The level of the rewards.
     * @returns {Array<Role>} The rewards.
     */
    rewards(lvl) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/roles/?reward=${lvl}`, 'GET')
                .then(resp => {
                    const rewards = [];
                    resp?.forEach(r => {
                        const tmp = new Role(r, this.guild, this.client);
                        rewards.push(tmp);
                        this.cache.set(tmp.id, tmp);
                    });
                    resolve(rewards);
                })
                .catch(reject);
        });
    }
}

module.exports = RoleManager;
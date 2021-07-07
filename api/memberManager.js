/* eslint-disable */
const Member = require('./member');
const Guild = require('./guild');
const Client = require('./client');
/* eslint-enable */

class MemberManager {
    /**
     * Create a new MemberManager for the guild.
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
         * The id of the guild the members are part of.
         * @type {Snowflake}
         */
        this.guildID = guild.guildID;

        /**
         * The guild the members are part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The map containing all tracked members.
         * @type {Map<string, Member>}
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the member if it is in the database.
     * @param {string} id Id of the guild.
     * @returns {?Member} The resolved member.
     */
    async resolve(id) {
        let member = this.cache.get(id);
        if (member !== undefined) {
            return member;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.guildID}/members/${id}`, 'GET');
            member = new Member(res, this.guild, this.client);
        }
        catch (err) {
            console.error(err);
        }
        if (member) {
            this.cache.set(member.memberID, member);
        }
        return member;
    }

    /**
     * Create a new member for this guild.
     * @param {Object} member The member from the API.
     * @param {Snowflake} member.memberID The ID of the member.
     * @param {?Date} member.joinedAt The date when member first joined the guild.
     * @param {?number} member.left The number of time this member left the guild.
     * @param {?number} member.xp The xp of the member.
     * @param {?number} member.level The level of the member.
     * @returns {?Member} The member if it was created.
     */
    async create(member) {
        const memb = new Member(member, this.guild, this.client);
        try {
            const resp = await this.client.api.request(`/guilds/${this.guildID}/members/`, 'POST', memb);
            Object.assign(memb, resp);
            this.cache.set(memb.memberID, memb);
        } catch (err) {
            console.error(err);
            return undefined;
        }
        return memb;
    }

    /**
     * Reset all the members of the guild. (whether cached or not)
     */
    async reset() {
        try {
            await this.client.api.request(`/guilds/${this.guildID}/reset`, 'POST');
            this.cache.clear();
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = MemberManager;
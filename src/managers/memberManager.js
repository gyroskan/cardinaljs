/* eslint-disable */
const Member = require('../structures/member');
const Guild = require('../structures/guild');
const Client = require('../structures/client');
const APIError = require('../api/apiError');
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
         * @readonly
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the member if it is in the database.
     * @param {string} id Id of the guild.
     * @returns {Promise<Member | undefined>} The resolved member.
     */
    async resolve(id) {
        let member = this.cache.get(id);
        if (member !== undefined) {
            return member;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.guildID}/members/${id}`, 'GET');
            member = new Member(res, this.guild, this.client);
            this.cache.set(member.memberID, member);
            return member;
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
     * @param {Object} member The member from the API.
     * @param {Snowflake} member.memberID The ID of the member.
     * @param {?Date} [member.joinedAt] The date when member first joined the guild.
     * @param {number} [member.left] The number of time this member left the guild.
     * @param {number} [member.xp] The xp of the member.
     * @param {number} [member.level] The level of the member.
     * @returns {Promise<Member>} The member if it was created.
     */
    create(member) {
        const memb = new Member(member, this.guild, this.client);
        // eslint-disable-next-line
        const { client, bans, guild, warns, ...obj } = memb;
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/`, 'POST', obj)
                .then(resp => {
                    Object.assign(memb, resp);
                    this.cache.set(memb.memberID, memb);
                    resolve(memb);
                })
                .catch(reject);
        });
    }

    /**
     * Reset all the members part of this guild. (whether cached or not)
     * @returns {Promise<Guild>} The guild of the members.
     */
    resetMembers() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/reset`, 'POST')
                .then(() => {
                    this.cache.clear();
                    resolve(this.guild);
                })
                .catch(reject);
        });
    }
}

module.exports = MemberManager;
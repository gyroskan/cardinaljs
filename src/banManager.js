/* eslint-disable */
const Member = require('./member');
const Client = require('./client');
const Ban = require('./ban');
const APIError = require('./apiError');
/* eslint-enable */

class BanManager {
    /**
     * Create a new banManager for the member.
     * @param {Client} client The client to connect to the API.
     * @param {Member} member The member of the bans.
     */
    constructor(client, member) {
        /**
         * The client to connect to the API.
         * @type {Client}
         */
        this.client = client;

        /**
         * The id of the member the bans are part of.
         * @type {Snowflake}
         */
        this.memberID = member.id;

        /**
         * The member the bans are part of.
         * @type {Member}
         */
        this.member = member;

        /**
         * The map containing all tracked bans.
         * @type {Map<string, Ban>}
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the ban if it is in the database.
     * @param {string} id Id of the ban.
     * @returns {?Ban} The resolved ban.
     */
    async resolve(id) {
        let ban = this.cache.get(id);
        if (ban !== undefined) {
            return ban;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/bans/${id}`, 'GET');
            ban = new Ban(res, this.member, this.client);
            this.cache.set(ban.banID, ban);
            return ban;
        }
        catch (err) {
            if (!(err instanceof APIError) || err.code != 404) {
                console.error(err);
            }
            return undefined;
        }
    }

    /**
     * Create a new ban for this member.
     * @param {Object} ban The ban from the API.
     * @param {Snowflake} ban.banID The ID of the ban.
     * @param {?Snowflake} ban.bannerID The ID of the banner.
     * @param {?Date} ban.bannedAt The date of the ban.
     * @param {?string} ban.banReason The reason of the ban.
     * @param {?boolean} ban.autoBan Wether it was a ban after max warns or not.
     * @returns {Promise<Ban, Error>} The ban if it was created.
     */
    create(ban) {
        const b = new Ban(ban, this.guild, this.client);
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/bans/`, 'POST', b)
                .then(resp => {
                    Object.assign(b, resp);
                    this.cache.set(b.banID, b);
                    resolve(b);
                })
                .catch(reject);
        });
    }
}

module.exports = BanManager;
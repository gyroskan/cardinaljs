/* eslint-disable */
const Member = require('../structures/member');
const Client = require('../structures/client');
const Ban = require('../structures/ban');
const APIError = require('../api/apiError');
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
         * @readonly
         */
        this.cache = new Map();
    }


    /**
     * Fetch the bans received by this member.
     * @returns {Promise<Array<Ban>>} The array of bans.
     */
    async fetch() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/bans/`, 'GET')
                .then(resp => {
                    const bans = [];
                    resp?.forEach(b => {
                        const tmp = new Ban(b, this.member, this.client);
                        bans.push(tmp);
                        this.cache.set(tmp.id, tmp);
                    });
                    resolve(bans);
                })
                .catch(reject);
        });
    }

    /**
     * resolve returns the ban if it is in the database.
     * @param {string} id Id of the ban.
     * @returns {Promise<Ban | undefined>} The resolved ban.
     */
    async resolve(id) {
        let ban = this.cache.get(id);
        if (ban !== undefined) {
            return ban;
        }

        try {
            const res = await this.client.api.request(
                `/guilds/${this.member.guildID}/members/${this.memberID}/bans/${id}`,
                'GET');
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
     * @param {number} ban.banID The ID of the ban.
     * @param {?Snowflake} [ban.bannerID] The ID of the banner.
     * @param {?Date} [ban.bannedAt] The date of the ban.
     * @param {?string} [ban.banReason] The reason of the ban.
     * @param {boolean} [ban.autoBan] Wether it was a ban after max warns or not.
     * @returns {Promise<Ban>} The ban if it was created.
     */
    create(ban) {
        const b = new Ban(ban, this.guild, this.client);
        // eslint-disable-next-line
        const { client, member, ...obj } = b;
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/bans/`, 'POST', obj)
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
/* eslint-disable */
const Client = require('./client');
const Member = require('./member');
/* eslint-enable */

class Ban {
    /**
     * Create a new ban.
     * @param {Object} ban
     * @param {Snowflake} ban.banID
     * @param {?Snowflake} ban.bannerID
     * @param {?Date} ban.bannedAt
     * @param {?string} ban.banReason
     * @param {?boolean} ban.autoBan
     * @param {Member} member The member this ban is part of.
     * @param {Client} client The client used to connect to the API.
     * @returns The created ban.
     */
    constructor(ban, member, client) {
        /**
         * @type {Client}
         */
        this.client = client;
        if (!client)
            return undefined;

        /**
         * The member this ban is part of.
         * @type {Member}
         */
        this.member = member;

        /**
         * The id of the ban.
         * @type {Snowflake}
         */
        this.banID = ban.banID;

        /**
         * The id of the member this ban is part of.
         * @type {Snowflake}
         */
        this.memberID = member.id;

        /**
         * The id of the banner.
         * @type {Snowflake}
         */
        this.bannerID = ban.bannerID ? ban.bannerID : null;

        /**
         * The date when the member was banned.
         * @type {?Date}
         */
        this.bannedAt = ban.bannedAt ? ban.bannedAt : new Date();

        /**
         * The reason of the ban.
         * @type {?string}
         */
        this.banReason = ban.banReason ? ban.banReason : null;

        /**
         * Whether the ban was made after too much warns.
         * @type {boolean}
         */
        this.autoBan = ban.autoBan ? ban.autoBan : true;
    }

    /**
    * The ID of this ban
    * @type {Snowflake}
    * @readonly
    */
    get id() {
        return this.banID;
    }

    /**
     * Delete the ban.
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/members/${this.memberID}/bans/${this.banID}`, 'DELETE')
                .then(() => resolve(this.member.bans.cache.delete(this.banID)))
                .catch(err => reject(err));
        });
    }
}

module.exports = Ban;
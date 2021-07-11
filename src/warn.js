/* eslint-disable */
const Client = require('./client');
const Member = require('./member');
/* eslint-enable */

class Warn {
    /**
     * Create a new warn.
     * @param {Object} warn
     * @param {Snowflake} warn.warnID
     * @param {?Snowflake} warn.warnnerID
     * @param {?Date} warn.warnnedAt
     * @param {?string} warn.warnReason
     * @param {Member} member The member this warn is part of.
     * @param {Client} client The client used to connect to the API.
     * @returns The created warn.
     */
    constructor(warn, member, client) {
        /**
         * @type {Client}
         */
        this.client = client;
        if (!client)
            return undefined;

        /**
         * The member this warn is part of.
         * @type {Member}
         */
        this.member = member;

        /**
         * The id of the warn.
         * @type {Snowflake}
         */
        this.warnID = warn.warnID;

        /**
         * The id of the member this warn is part of.
         * @type {Snowflake}
         */
        this.memberID = member.id;

        /**
         * The id of the warnner.
         * @type {Snowflake}
         */
        this.warnnerID = warn.warnnerID ? warn.warnnerID : null;

        /**
         * The date when the member was warnned.
         * @type {?Date}
         */
        this.warnnedAt = warn.warnnedAt ? warn.warnnedAt : new Date();

        /**
         * The reason of the warn.
         * @type {?string}
         */
        this.warnReason = warn.warnReason ? warn.warnReason : null;
    }

    /**
    * The ID of this warn
    * @type {Snowflake}
    * @readonly
    */
    get id() {
        return this.warnID;
    }

    /**
     * Delete the warn.
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.member.guildID}/members/${this.memberID}/warns/${this.warnID}`, 'DELETE')
                .then(() => resolve(this.member.warns.cache.delete(this.warnID)))
                .catch(err => reject(err));
        });
    }
}

module.exports = Warn;
/* eslint-disable */
const Member = require('./member');
const Client = require('./client');
const Warn = require('./warn');
const APIError = require('./apiError');
/* eslint-enable */

class WarnManager {
    /**
     * Create a new warnManager for the member.
     * @param {Client} client The client to connect to the API.
     * @param {Member} member The member of the warns.
     */
    constructor(client, member) {
        /**
         * The client to connect to the API.
         * @type {Client}
         */
        this.client = client;

        /**
         * The id of the member the warns are part of.
         * @type {Snowflake}
         */
        this.memberID = member.id;

        /**
         * The member the warns are part of.
         * @type {Member}
         */
        this.member = member;

        /**
         * The map containing all tracked warns.
         * @type {Map<string, Warn>}
         */
        this.cache = new Map();
    }

    /**
     * resolve returns the warn if it is in the database.
     * @param {string} id Id of the warn.
     * @returns {?Warn} The resolved warn.
     */
    async resolve(id) {
        let warn = this.cache.get(id);
        if (warn !== undefined) {
            return warn;
        }

        try {
            const res = await this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/warns/${id}`, 'GET');
            warn = new Warn(res, this.member, this.client);
            this.cache.set(warn.warnID, warn);
            return warn;
        }
        catch (err) {
            if (!(err instanceof APIError) || err.code != 404) {
                console.error(err);
            }
            return undefined;
        }
    }

    /**
     * Create a new warn for this member.
     * @param {Object} warn The warn from the API.
     * @param {Snowflake} warn.warnID The ID of the warn.
     * @param {Snowflake} warn.warnnerID The ID of the warnner.
     * @param {?Date} warn.warnnedAt
     * @param {?string} warn.warnReason
     * @returns {Promise<Warn, Error>} The warn if it was created.
     */
    create(warn) {
        const w = new warn(warn, this.guild, this.client);
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/warns/`, 'POST', w)
                .then(resp => {
                    Object.assign(w, resp);
                    this.cache.set(w.warnID, w);
                    resolve(w);
                })
                .catch(reject);
        });
    }
}

module.exports = WarnManager;
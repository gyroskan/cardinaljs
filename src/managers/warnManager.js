/* eslint-disable */
const Member = require('../structures/member');
const Client = require('../structures/client');
const Warn = require('../structures/warn');
const APIError = require('../api/apiError');
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
     * Fetch the warns received by this member.
     * @returns {Promise<Array<Warn>>} The array of warns.
     */
    async fetch() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/warns/`, 'GET')
                .then(resp => {
                    const warns = [];
                    resp?.forEach(w => {
                        const tmp = new Warn(w, this.member, this.client);
                        warns.push(tmp);
                        this.cache.set(tmp.id, tmp);
                    });
                    resolve(warns);
                })
                .catch(reject);
        });
    }

    /**
     * resolve returns the warn if it is in the database.
     * @param {string} id Id of the warn.
     * @returns {Promise<Warn | undefined} The resolved warn.
     */
    async resolve(id) {
        let warn = this.cache.get(id);
        if (warn !== undefined) {
            return warn;
        }

        try {
            const res = await this.client.api.request(
                `/guilds/${this.member.guildID}/members/${this.memberID}/warns/${id}`,
                'GET');
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
     * @param {?Snowflake} [warn.warnnerID] The ID of the warnner.
     * @param {?Date} [warn.warnnedAt] The date when the member was warnned.
     * @param {?string} [warn.warnReason] The reason of the warn.
     * @returns {Promise<Warn>} The warn if it was created.
     */
    create(warn) {
        const w = new Warn(warn, this.guild, this.client);
        // eslint-disable-next-line
        const { client, member, ...obj } = w;
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.member.guildID}/members/${this.memberID}/warns/`, 'POST', obj)
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
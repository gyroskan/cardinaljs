/* eslint-disable*/
const Api = require('../api/api');
const BanManager = require('../managers/banManager');
const WarnManager = require('../managers/warnManager');
const Client = require('./client');
const Guild = require('./guild');
/* eslint-enable*/

class Member {
    /**
     * Create a new member.
     * @param {Object} member The member from the API.
     * @param {Snowflake} member.memberID The ID of the member.
     * @param {?Date} [member.joinedAt] The date when member first joined the guild.
     * @param {number} [member.left] The number of time this member left the guild.
     * @param {number} [member.xp] The xp of the member.
     * @param {number} [member.level] The level of the member.
     * @param {Guild} guild The guild of the member.
     * @param {Client} client The client used to connect to the API.
     * @returns {Member}
     */
    constructor(member, guild, client) {
        /**
        * @type {Client}
        */
        this.client = client;
        if (!client) {
            return undefined;
        }

        /**
         * The ID of this member.
         * @type {Snowflake}
         */
        this.memberID = member.memberID;

        /**
        * The ID of the guild the member is part of.
        * @type {Snowflake}
        */
        this.guildID = guild.guildID;

        /**
         * The guild the member is part of.
         * @type {Guild}
         */
        this.guild = guild;

        /**
         * The Date when the member first joined the guild.
         * @type {Date}
         */
        this.joinedAt = member.joinedAt ? new Date(member.joinedAt) : new Date();

        /**
         * The number of time this member left the guild.
         * @type {number}
         */
        this.left = member.left ? member.left : 0;

        /**
         * The xp of the member.
         * @type {number}
         */
        this.xp = member.xp ? member.xp : 0;

        /**
         * The level of the member.
         * @type {number}
         */
        this.level = member.level ? member.level : 0;

        /**
         * The ban manager of this member.
         * @type {BanManager}
         * @readonly
         */
        this.bans = new BanManager(this.client, this);

        /**
         * The warn manager of this member.
         * @type {WarnManager}
         * @readonly
         */
        this.warns = new WarnManager(this.client, this);
    }

    /**
    * The ID of this member.
    * @type {Snowflake}
    */
    get id() {
        return this.memberID;
    }

    /**
     * Add 1 to left property.
     * @returns {Promise<Member>} The member after modification.
     */
    addLeft() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/${this.memberID}`, 'PATCH', { left: this.left++ })
                .then(m => {
                    Object.assign(this, m);
                    resolve(this);
                })
                .catch(err => reject(err));
        });
    }

    /**
     * Add xp to the member xp.
     * @param {number} amount The amount of xp to add.
     * @returns {Promise<Member>} The member after modification.
     */
    addXP(amount) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/${this.memberID}`, 'PATCH', {
                xp: this.xp + amount,
                level: this.level + (this.xp + amount >= getXp(this.level + 1))
            }).then(m => {
                Object.assign(this, m);
                resolve(this);
            }).catch(err => {
                reject(err);
            });
        });
    }

    /**
     * Delete the member.
     * @returns {Promise<boolean>} Whether it was deleted or not.
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/${this.memberID}`, 'DELETE')
                .then(() => resolve(this.guild.members.cache.delete(this.memberID)))
                .catch(err => reject(err));
        });
    }

    /**
     * Reset all values of the member.
     * @returns {Promise<Member>} The member after modification.
     */
    reset() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/members/${this.memberID}/reset`, 'POST')
                .then(m => {
                    Object.assign(this, m);
                    resolve(this);
                }).catch(err => {
                    reject(err);
                });
        });
    }
}


function getXp(lvl) {
    return lvl * (2.5 * lvl * lvl + 8.5 * lvl + 89);
}

module.exports = Member;
/* eslint-disable*/
const Api = require('./api');
const BanManager = require('./banManager');
const WarnManager = require('./warnManager');
const Client = require('./client');
const Guild = require('./guild');
/* eslint-enable*/

class Member {
    /**
     * Create a new member.
     * @param {Object} member The member from the API.
     * @param {Snowflake} member.memberID The ID of the member.
     * @param {?Date} member.joinedAt The date when member first joined the guild.
     * @param {?number} member.left The number of time this member left the guild.
     * @param {?number} member.xp The xp of the member.
     * @param {?number} member.level The level of the member.
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
         * @readonly
         */
        this.memberID = member.memberID;

        /**
        * The ID of the guild the member is part of.
        * @type {Snowflake}
        * @readonly
        */
        this.guildID = guild.guildID;

        /**
         * The guild the member is part of.
         * @type {Guild}
         * @readonly
         */
        this.guild = guild;

        /**
         * The Date when the member first joined the guild.
         * @type {Date}
         * @readonly
         */
        this.joinedAt = member.joinedAt ? member.joinedAt : Date.now();

        /**
         * The number of time this member left the guild.
         * @type {number}
         * @readonly
         */
        this.left = member.left ? member.left : 0;

        /**
         * The xp of the member.
         * @type {number}
         * @readonly
         */
        this.xp = member.xp ? member.xp : 0;

        /**
         * The level of the member.
         * @type {number}
         * @readonly
         */
        this.level = member.level ? member.level : 0;

        /**
         * The ban manager of this member.
         * @type {BanManager}
         */
        this.bans = new BanManager(this.client, this);

        /**
         * The warn manager of this member.
         * @type {WarnManager}
         */
        this.warns = new WarnManager(this.client, this);
    }

    /**
    * The ID of this member
    * @type {Snowflake}
    * @readonly
    */
    get id() {
        return this.memberID;
    }

    /**
     * Add 1 to left property
     */
    addLeft() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/members/${this.memberID}`, 'PATCH', { left: this.left++ })
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
     */
    addXP(amount) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/members/${this.memberID}`, 'PATCH', {
                xp: this.xp + amount,
                level: this.level + (this.xp + amount >= getXp(this.level))
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
     */
    delete() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/members/${this.memberID}`, 'DELETE')
                .then(() => resolve(this.guild.members.cache.delete(this.memberID)))
                .catch(err => reject(err));
        });
    }

    /**
     * Reset all values of the member.
     */
    reset() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guild/${this.guildID}/members/${this.memberID}/reset`, 'POST')
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
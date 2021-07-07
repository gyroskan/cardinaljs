/* eslint-disable*/
const Api = require('./api');
const Client = require('./client');
const Guild = require('./guild');
/* eslint-enable*/

/**
 * @type {Client}
 */
let _client = undefined;

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
        _client = client;
        if (client == undefined) {
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
    }

    /**
     * Add 1 to left property
     */
    addLeft() {
        return new Promise((resolve, reject) => {
            _client.api.request(`/guild/${this.guildID}/${this.memberID}`, 'PATCH', { left: this.left++ })
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
            _client.api.request(`/guild/${this.guildID}/${this.memberID}`, 'PATCH', {
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
    async delete() {
        await _client.api.request(`/guild/${this.guildID}/${this.memberID}`, 'DELETE');
        return this.guild.members.cache.delete(this.memberID);
    }
}


function getXp(lvl) {
    return lvl * (2.5 * lvl * lvl + 8.5 * lvl + 89);
}

module.exports = Member;
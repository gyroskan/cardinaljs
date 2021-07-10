/* eslint-disable */
const Api = require("./api");
const Client = require("./client");
const MemberManager = require("./memberManager");
const RoleManager = require("./roleManager");
/* eslint-enable */

/**
 * @type {Client}
 */
let _client = undefined;

class Guild {
    /**
     * @param {Client} client The client connected to cardinal api.
     * @param {Object} guild
     * @param {string} guild.guildName
     * @param {?Snowflake} guild.reportChannel
     * @param {?Snowflake} guild.welcomeChannel
     * @param {?string} guild.welcomeMsg
     * @param {?string} guild.privateWelcomeMsg
     * @param {?Snowflake} guild.lvlChannel
     * @param {?number} guild.lvlReplace
     * @param {?number} guild.lvlResponse
     * @param {?string} guild.disabledCommands
     * @param {?boolean} guild.allowModeration
     * @param {?number} guild.maxWarns
     * @param {?number} guild.banTime
     */
    constructor(guild, client) {
        _client = client;
        if (client === undefined) {
            return undefined;
        }

        /**
        * The ID of this guild
        * @type {Snowflake}
        * @readonly
        */
        this.guildID = guild.guildID;

        if (!this.guildID)
            return undefined;

        /**
         * The name of this guild.
         * @type {string}
         * @readonly
         */
        this.guildName = guild.guildName;


        /**
         * The channel used to send reports.
         * @type {Snowflake}
         * @readonly
         */
        this.reportChannel = guild.reportChannel ? guild.reportChannel : null;

        /**
         * The channel used to send welcome messages.
         * @type {string}
         * @readonly
         */
        this.welcomeChannel = guild.welcomeChannel ? guild.welcomeChannel : null;

        /**
         * The message send to new members.
         * @type {string}
         * @readonly
         */
        this.welcomeMsg = guild.welcomeMsg;

        /**
         * The message send in DM to new members.
         * @type {string}
         * @readonly
         */
        this.privateWelcomeMsg = guild.privateWelcomeMsg;

        /**
         * The channel where lvl up messages are sent.
         * @type {Snowflake}
         * @readonly
         */
        this.lvlChannel = guild.lvlChannel ? guild.lvlChannel : null;

        /**
         * Wether rewards are replaced on lvl up or not.
         * @type {boolean}
         * @readonly
         */
        this.lvlReplace = guild.lvlReplace ? true : false;

        /**
         * On which lvl does the bot send a lvl up message. (0 means never).
         * @type {number}
         * @readonly
         */
        this.lvlResponse = guild.lvlResponse ? guild.lvlResponse : 0;

        /**
         * The list of names of disabled commands.
         * @type {Array<string>}
         */
        this.disabledCommands = guild.disabledCommands?.split('/');

        /**
         * Whether moderation commands are allowed or not.
         * @type {boolean}
         * @readonly
         */
        this.allowModeration = guild.allowModeration ? guild.allowModeration : true;

        /**
         * The number of warns before a member get banned. (0 means never get banned from warns).
         * @type {number}
         * @readonly
         */
        this.maxWarns = guild.maxWarns ? guild.maxWarns : 3;

        /**
         * The number of days a ban last. (between 0 and 7).
         * @type {number}
         * @readonly
         */
        this.banTime = guild.banTime ? guild.banTime : 1;

        /**
         * The member manager for this guild.
         * @type {MemberManager}
         * @readonly
         */
        this.members = new MemberManager(_client, this);


        /**
         * The role manager for this guild.
         * @type {RoleManager}
         * @readonly
         */
        this.roles = new RoleManager(_client, this);
    }

    /**
    * The ID of this guild
    * @type {Snowflake}
    * @readonly
    */
    get id() {
        return this.guildID;
    }

    /**
     * The name of this guild.
     * @type {string}
     * @readonly
     */
    get name() {
        return this.guildName;
    }

    /**
     * Updates the guild with new values.
     * @param data
     * @param data.guildName
     * @param data.reportChannel
     * @param data.welcomeChannel
     * @param data.welcomeMsg
     * @param data.privateWelcomeMsg
     * @param data.lvlChannel
     * @param data.lvlReplace
     * @param data.lvlResponse
     * @param data.disabledCommands
     * @param data.allowModeration
     * @param data.maxWarns
     * @param data.banTime
     */
    edit(data) {
        return new Promise((resolve, reject) => {
            _client.api.request(`/guilds/${this.guildID}`, 'PATCH', data)
                .then(guild => {
                    Object.assign(this, guild);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Reset all the parameters of the guild, except the members.
     * @returns {Promise<Guild,Error>} The modified guild.
     */
    reset() {
        return new Promise((resolve, reject) => {
            _client.api.request(`guilds/${this.guildID}/reset`, 'POST')
                .then(guild => {
                    Object.assign(this, guild);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Delete the guild from the api.
     * @returns {Promise<boolean,Error>} Whether the guild was deleted.
     */
    delete() {
        return new Promise((resolve, reject) => {
            _client.api.request(`/guilds/${this.guildID}`, 'DELETE')
                .then(() => resolve(_client.guilds.cache.delete(this.guildID)))
                .catch(reject);
        });
    }
}

module.exports = Guild;
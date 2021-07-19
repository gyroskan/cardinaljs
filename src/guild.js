/* eslint-disable */
const Api = require("./api");
const Client = require("./client");
const MemberManager = require("./memberManager");
const RoleManager = require("./roleManager");
/* eslint-enable */

class Guild {
    /**
     * @param {Client} client The client connected to cardinal api.
     * @param {Object} guild The guild object.
     * @param {Snowflake} guild.guildID The ID of this guild.
     * @param {string} guild.guildName The name of this guild.
     * @param {string} guild.prefix The prefix used for the discord bot .
     * @param {?Snowflake} guild.reportChannel The channel used to send reports.
     * @param {?Snowflake} guild.welcomeChannel The channel used to send welcome messages.
     * @param {?string} guild.welcomeMsg The message send to new members.
     * @param {?string} guild.privateWelcomeMsg The message send in DM to new members.
     * @param {?Snowflake} guild.lvlChannel The channel where lvl up messages are sent.
     * @param {?number} guild.lvlReplace Wether rewards are replaced on lvl up or not.
     * @param {?number} guild.lvlResponse On which lvl does the bot send a lvl up message. (0 means never).
     * @param {?string} guild.disabledCommands The list of names of disabled commands.
     * @param {?boolean} guild.allowModeration Whether moderation commands are allowed or not.
     * @param {?number} guild.maxWarns The number of warns before a member get banned. (0 means never get banned from warns).
     * @param {?number} guild.banTime The number of days a ban last. (between 0 and 7).
     */
    constructor(guild, client) {
        /**
         * The client used to connect to the API.
         * @type {Client}
         */
        this.client = client;
        if (!client) {
            return undefined;
        }

        /**
        * The ID of this guild.
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
         * The Prefix used for the discord Bot.
         * @type {string}
         */
        this.prefix = guild.prefix;


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
        this.members = new MemberManager(this.client, this);


        /**
         * The role manager for this guild.
         * @type {RoleManager}
         * @readonly
         */
        this.roles = new RoleManager(this.client, this);
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
     * @param data The patch values object. 
     * @param data.guildName The name of this guild.
     * @param data.prefix The prefix used for the discord bot.
     * @param data.reportChannel The channel used to send reports.
     * @param data.welcomeChannel The channel used to send welcome messages.
     * @param data.welcomeMsg The message send to new members.
     * @param data.privateWelcomeMsg The message send in DM to new members.
     * @param data.lvlChannel The channel where lvl up messages are sent.
     * @param data.lvlReplace Wether rewards are replaced on lvl up or not.
     * @param data.lvlResponse On which lvl does the bot send a lvl up message. (0 means never).
     * @param data.disabledCommands The list of names of disabled commands.
     * @param data.allowModeration Whether moderation commands are allowed or not.
     * @param data.maxWarns The number of warns before a member get banned. (0 means never get banned from warns).
     * @param data.banTime The number of days a ban last. (between 0 and 7).
     */
    edit(data) {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}`, 'PATCH', data)
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
            this.client.api.request(`guilds/${this.guildID}/reset`, 'POST')
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
            this.client.api.request(`/guilds/${this.guildID}`, 'DELETE')
                .then(() => resolve(this.client.guilds.cache.delete(this.guildID)))
                .catch(reject);
        });
    }
}

module.exports = Guild;
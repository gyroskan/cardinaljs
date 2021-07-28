/* eslint-disable */
const Api = require("../api/api");
const Client = require("./client");
const MemberManager = require("../managers/memberManager");
const RoleManager = require("../managers/roleManager");
const ChannelManager = require("../managers/channelManager");
/* eslint-enable */

class Guild {
    /**
     * @param {Client} client The client connected to cardinal api.
     * @param {Object} guild The guild object.
     * @param {Snowflake} guild.guildID The ID of this guild.
     * @param {string} guild.guildName The name of this guild.
     * @param {string} [guild.prefix] The prefix used for the discord bot .
     * @param {Snowflake} [guild.reportChannel] The channel used to send reports.
     * @param {Snowflake} [guild.welcomeChannel] The channel used to send welcome messages.
     * @param {string} [guild.welcomeMsg] The message send to new members.
     * @param {string} [guild.privateWelcomeMsg] The message send in DM to new members.
     * @param {Snowflake} [guild.lvlChannel] The channel where lvl up messages are sent.
     * @param {number} [guild.lvlReplace] Wether rewards are replaced on lvl up or not.
     * @param {number} [guild.lvlResponse] On which lvl does the bot send a lvl up message. (0 means never).
     * @param {string} [guild.disabledCommands] The list of names of disabled commands.
     * @param {boolean} [guild.allowModeration] Whether moderation commands are allowed or not.
     * @param {number} [guild.maxWarns] The number of warns before a member get banned. (0 means never get banned from warns).
     * @param {number} [guild.banTime] The number of days a ban last. (between 0 and 7).
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
         */
        this.guildName = guild.guildName;

        /**
         * The Prefix used for the discord Bot.
         * @type {string}
         */
        this.prefix = guild.prefix ? guild.prefix : '%';


        /**
         * The channel used to send reports.
         * @type {?Snowflake}
         */
        this.reportChannel = guild.reportChannel ? guild.reportChannel : null;

        /**
         * The channel used to send welcome messages.
         * @type {?string}
         */
        this.welcomeChannel = guild.welcomeChannel ? guild.welcomeChannel : null;

        /**
         * The message send to new members.
         * @type {?string}
         */
        this.welcomeMsg = guild.welcomeMsg ? guild.welcomeMsg : null;

        /**
         * The message send in DM to new members.
         * @type {?string}
         */
        this.privateWelcomeMsg = guild.privateWelcomeMsg ? guild.privateWelcomeMsg : null;

        /**
         * The channel where lvl up messages are sent.
         * @type {?Snowflake}
         */
        this.lvlChannel = guild.lvlChannel ? guild.lvlChannel : null;

        /**
         * Wether rewards are replaced on lvl up or not.
         * @type {boolean}
         */
        this.lvlReplace = guild.lvlReplace ? true : false;

        /**
         * On which lvl does the bot send a lvl up message. (0 means never).
         * @type {number}
         */
        this.lvlResponse = guild.lvlResponse ? guild.lvlResponse : 0;

        /**
         * The list of names of disabled commands.
         * @type {?Array<string>}
         */
        this.disabledCommands = guild.disabledCommands?.split('/');

        /**
         * Whether moderation commands are allowed or not.
         * @type {boolean}
         */
        this.allowModeration = guild.allowModeration ? guild.allowModeration : true;

        /**
         * The number of warns before a member get banned. (0 means never get banned from warns).
         * @type {number}
         */
        this.maxWarns = guild.maxWarns ? guild.maxWarns : 3;

        /**
         * The number of days a ban last. (between 0 and 7).
         * @type {number}
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

        /**
         * The channel manager for this guild.
         * @type {ChannelManager}
         * @readonly
         */
        this.channels = new ChannelManager(this.client, this);
    }

    /**
    * The ID of this guild
    * @type {Snowflake}
    */
    get id() {
        return this.guildID;
    }

    /**
     * The name of this guild.
     * @type {string}
     */
    get name() {
        return this.guildName;
    }

    /**
     * Updates the guild with new values.
     * @param {Object} data The patch values object. 
     * @param {string} [data.guildName] The name of this guild.
     * @param {string} [data.prefix] The prefix used for the discord bot.
     * @param {?Snowflake} [data.reportChannel] The channel used to send reports.
     * @param {?Snowflake} [data.welcomeChannel] The channel used to send welcome messages.
     * @param {?string} [data.welcomeMsg] The message send to new members.
     * @param {?string} [data.privateWelcomeMsg] The message send in DM to new members.
     * @param {?Snowflake} [data.lvlChannel] The channel where lvl up messages are sent.
     * @param {boolean} [data.lvlReplace] Wether rewards are replaced on lvl up or not.
     * @param {number} [data.lvlResponse] On which lvl does the bot send a lvl up message. (0 means never).
     * @param {?string} [data.disabledCommands] The list of names of disabled commands.
     * @param {boolean} [data.allowModeration] Whether moderation commands are allowed or not.
     * @param {number} [data.maxWarns] The number of warns before a member get banned. (0 means never get banned from warns).
     * @param {number} [data.banTime] The number of days a ban last. (between 0 and 7).
     * @returns {Promise<Guild>} The edited guild object.
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
     * @returns {Promise<Guild>} The modified guild.
     */
    reset() {
        return new Promise((resolve, reject) => {
            this.client.api.request(`/guilds/${this.guildID}/reset`, 'POST')
                .then(guild => {
                    Object.assign(this, guild);
                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Delete the guild from the api.
     * @returns {Promise<boolean>} Whether the guild was deleted.
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
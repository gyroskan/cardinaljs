const Api = require("./api");
const Client = require("./client");
const MemberManager = require("./memberManager");

/**
 * @type {Client}
 */
let _client = undefined;

class Guild {
    /**
     * @param {Client} client The client connected to cardinal api.
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
        this.reportChannel = guild.reportChannel;

        /**
         * The channel used to send welcome messages.
         * @type {string}
         * @readonly
         */
        this.welcomeChannel = guild.welcomeChannel;

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
        this.lvlChannel = guild.lvlChannel;

        /**
         * Wether rewards are replaced on lvl up or not.
         * @type {boolean}
         * @readonly
         */
        this.lvlReplace = guild.lvlReplace;

        /**
         * On which lvl does the bot send a lvl up message. (0 means never).
         * @type {number}
         * @readonly
         */
        this.lvlResponse = guild.lvlResponse;

        /**
         * The list of names of disabled commands.
         * @type {Array<string>}
         */
        this.disabledCommands = guild.disabledCommands.split('/');

        /**
         * Whether moderation commands are allowed or not.
         * @type {boolean}
         * @readonly
         */
        this.allowModeration = guild.allowModeration;

        /**
         * The number of warns before a member get banned. (0 means never get banned from warns).
         * @type {number}
         * @readonly
         */
        this.maxWarns = guild.maxWarns;

        /**
         * The number of days a ban last. (between 0 and 7).
         * @type {number}
         * @readonly
         */
        this.banTime = guild.banTime;

        /**
         * The member manager for this guild.
         * @type {MemberManager}
         * @readonly
         */
        this.members; //TODO new member manager.
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
     * update updates all valus of the guild.
     * Do not use this, every property needs a set function.
     */
    async update() {
        const guild = await _client.api.request(`/guilds/${this.guildID}`, 'PATCH', this);
        Object.assign(this, guild);
    }

    async delete() {
        return await _client.api.request(`/guilds/${this.guildID}`, 'DELETE') != null;
    }
}

module.exports = Guild;
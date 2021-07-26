module.exports = {
    Client: require('./structures/client'),
    Guild: require('./structures/guild'),
    Member: require('./structures/member'),
    Role: require('./structures/role'),
    Channel: require('./structures/channel'),
    Warn: require('./structures/warn'),
    Ban: require('./structures/ban'),

    // Managers
    GuildManager: require('./managers/guildManager'),
    MemberManager: require('./managers/memberManager'),
    RoleManager: require('./managers/roleManager'),
    ChannelManager: require('./managers/channelManager'),
    WarnManager: require('./managers/warnManager'),
    BanManager: require('./managers/banManager'),
};
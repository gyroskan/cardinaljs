module.exports = {
    Client: require('./client'),
    Guild: require('./guild'),
    Member: require('./member'),
    Role: require('./role'),
    Channel: require('./channel'),
    Warn: require('./warn'),
    Ban: require('./ban'),

    // Managers
    GuildManager: require('./guildManager'),
    MemberManager: require('./memberManager'),
    RoleManager: require('./roleManager'),
    ChannelManager: require('./channelManager'),
    WarnManager: require('./warnManager'),
    BanManager: require('./banManager'),
};
import { Snowflake } from "discord-api-types";

export class APIError extends Error {
    constructor(message: string, code: number, method: string, path: string, body: string | null);
    code: number;
    method: string;
    path: string;
    body: string | null;
}

export class Api {
    constructor(token: string, apiurl?: string | undefined, maxAttempt?: number | undefined);
    private token;
    apiurl: string;
    private header;
    private maxAttempt;
    connect(): Promise<string>;
    request(path: string, method: string, object?: object | undefined): Promise<object>;
}

export class Client {
    constructor(token?: string);
    token: string | null;
    api: Api;
    guilds: GuildManager;
    login(token?: string | undefined): Promise<string>;
}

export class GuildManager {
    constructor(client: Client);
    client: Client;
    readonly cache: Map<string, Guild>;
    resolve(id: string): Promise<Guild | undefined>;
    create(guild: {
        guildID: Snowflake;
        guildName: string;
        prefix?: string | undefined;
        reportChannel?: Snowflake;
        welcomeChannel?: Snowflake;
        welcomeMsg?: string | undefined;
        privateWelcomeMsg?: string | undefined;
        lvlChannel?: Snowflake;
        lvlReplace?: number | undefined;
        lvlResponse?: number | undefined;
        disabledCommands?: string | undefined;
        allowModeration?: boolean | undefined;
        maxWarns?: number | undefined;
        banTime?: number | undefined;
    }): Promise<Guild>;
}

export class MemberManager {
    constructor(client: Client, guild: Guild);
    client: Client;
    guildID: Snowflake;
    guild: Guild;
    readonly cache: Map<string, Member>;
    resolve(id: string): Promise<Member | undefined>;
    create(member: {
        memberID: Snowflake;
        joinedAt?: Date | null | undefined;
        left?: number | undefined;
        xp?: number | undefined;
        level?: number | undefined;
    }): Promise<Member>;
    resetMembers(): Promise<Guild>;
}

export class ChannelManager {
    constructor(client: Client, guild: Guild);
    client: Client;
    guildID: Snowflake;
    guild: Guild;
    readonly cache: Map<string, Channel>;
    resolve(id: string): Promise<Channel | undefined>;
    create(channel: {
        channelID: Snowflake;
        ignored?: number | undefined;
        xpBlacklisted?: number | undefined;
    }): Promise<Channel>;
}

export class RoleManager {
    constructor(client: Client, guild: Guild);
    client: Client;
    guildID: Snowflake;
    guild: Guild;
    cache: Map<string, Role>;
    resolve(id: string): Promise<Role | undefined>;
    create(role: {
        roleID: Snowflake;
        isDefault?: boolean | undefined;
        reward?: number | undefined;
        ignored?: boolean | undefined;
        xpBlacklisted?: boolean | undefined;
    }): Promise<Role>;
    rewards(lvl: number): Promise<Array<Role>>;
}

export class WarnManager {
    constructor(client: Client, member: Member);
    client: Client;
    memberID: Snowflake;
    member: Member;
    cache: Map<string, Warn>;
    fetch(): Promise<Array<Warn>>;
    resolve(id: string): Promise<Warn | undefined>;
    create(warn: {
        warnID: Snowflake;
        warnnerID?: Snowflake | null;
        warnnedAt?: Date | null | undefined;
        warnReason?: string | null | undefined;
    }): Promise<Warn>;
}

export class BanManager {
    constructor(client: Client, member: Member);
    client: Client;
    memberID: Snowflake;
    member: Member;
    readonly cache: Map<string, Ban>;
    fetch(): Promise<Array<Ban>>;
    resolve(id: string): Promise<Ban | undefined>;
    create(ban: {
        banID: Snowflake;
        bannerID?: Snowflake | null;
        bannedAt?: Date | null | undefined;
        banReason?: string | null | undefined;
        autoBan?: boolean | undefined;
    }): Promise<Ban>;
}

export class Guild {
    constructor(guild: {
        guildID: Snowflake;
        guildName: string;
        prefix?: string | undefined;
        reportChannel?: Snowflake;
        welcomeChannel?: Snowflake;
        welcomeMsg?: string | undefined;
        privateWelcomeMsg?: string | undefined;
        lvlChannel?: Snowflake;
        lvlReplace?: number | undefined;
        lvlResponse?: number | undefined;
        disabledCommands?: string | undefined;
        allowModeration?: boolean | undefined;
        maxWarns?: number | undefined;
        banTime?: number | undefined;
    }, client: Client);
    client: Client;
    readonly guildID: Snowflake;
    guildName: string;
    prefix: string;
    reportChannel: Snowflake | null;
    welcomeChannel: string | null;
    welcomeMsg: string | null;
    privateWelcomeMsg: string | null;
    lvlChannel: Snowflake | null;
    lvlReplace: boolean;
    lvlResponse: number;
    disabledCommands: Array<string> | null;
    allowModeration: boolean;
    maxWarns: number;
    banTime: number;
    readonly members: MemberManager;
    readonly roles: RoleManager;
    readonly channels: ChannelManager;
    get id(): Snowflake;
    get name(): string;
    edit(data: {
        guildName?: string | undefined;
        prefix?: string | undefined;
        reportChannel?: Snowflake | null;
        welcomeChannel?: Snowflake | null;
        welcomeMsg?: string | null | undefined;
        privateWelcomeMsg?: string | null | undefined;
        lvlChannel?: Snowflake | null;
        lvlReplace?: boolean | undefined;
        lvlResponse?: number | undefined;
        disabledCommands?: string | null | undefined;
        allowModeration?: boolean | undefined;
        maxWarns?: number | undefined;
        banTime?: number | undefined;
    }): Promise<Guild>;
    reset(): Promise<Guild>;
    delete(): Promise<boolean>;
}

export class Member {
    constructor(member: {
        memberID: Snowflake;
        joinedAt?: Date | null | undefined;
        left?: number | undefined;
        xp?: number | undefined;
        level?: number | undefined;
    }, guild: Guild, client: Client);
    client: Client;
    memberID: Snowflake;
    guildID: Snowflake;
    guild: Guild;
    joinedAt: Date;
    left: number;
    xp: number;
    level: number;
    readonly bans: BanManager;
    readonly warns: WarnManager;
    get id(): Snowflake;
    addLeft(): Promise<Member>;
    addXP(amount: number): Promise<Member>;
    delete(): Promise<boolean>;
    reset(): Promise<Member>;
}

export class Ban {
    constructor(ban: {
        banID: number;
        bannerID?: Snowflake | null;
        bannedAt?: Date | null | undefined;
        banReason?: string | null | undefined;
        autoBan?: boolean | undefined;
    }, member: Member, client: Client);
    client: Client;
    member: Member;
    banID: number;
    memberID: Snowflake;
    bannerID: Snowflake | null;
    bannedAt: Date | null;
    banReason: string | null;
    autoBan: boolean;
    get id(): number;
    delete(): Promise<boolean>;
}

export class Warn {
    constructor(warn: {
        warnID: number;
        warnnerID?: Snowflake | null;
        warnnedAt?: Date | null | undefined;
        warnReason?: string | null | undefined;
    }, member: Member, client: Client);
    client: Client;
    member: Member;
    warnID: number;
    memberID: Snowflake;
    warnnerID: Snowflake | null;
    warnnedAt: Date | null;
    warnReason: string | null;
    get id(): number;
    delete(): Promise<boolean>;
}

export class Role {
    constructor(role: {
        roleID: Snowflake;
        isDefault?: boolean | undefined;
        reward?: number | undefined;
        ignored?: boolean | undefined;
        xpBlacklisted?: boolean | undefined;
    }, guild: Guild, client: Client);
    client: Client;
    guild: Guild;
    roleID: Snowflake;
    guildID: Snowflake;
    isDefault: boolean;
    reward: number;
    ignored: boolean;
    xpBlacklisted: boolean;
    get id(): Snowflake;
    edit(data: {
        isDefault?: boolean | undefined;
        reward?: number | undefined;
        ignored?: boolean | undefined;
        xpBlacklisted?: boolean | undefined;
    }): Promise<Role>;
    delete(): Promise<boolean>;
}

export class Channel {
    constructor(channel: {
        channelID: Snowflake;
        ignored?: boolean | undefined;
        xpBlacklisted?: boolean | undefined;
    }, guild: Guild, client: Client);
    client: Client;
    guild: Guild;
    channelID: Snowflake;
    guildID: Snowflake;
    ignored: boolean;
    xpBlacklisted: boolean;
    get id(): Snowflake;
    edit(data: {
        ignored?: boolean | undefined;
        xpBlacklisted?: boolean | undefined;
    }): Promise<Channel>;
    delete(): Promise<boolean>;
}
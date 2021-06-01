import {Guild, GuildChannel, GuildMember, Message, MessageEmbed, TextChannel, User,} from "discord.js-light";
import FuzzySearch from "fuse.js";
import ms from "ms";

import type {Bot} from "../client/Client";
import premium_schema from "../models/premium_schema";
import guild_schema from "../models/GuildConfig/guild";
import serverset from "../models/GuildConfig/ReactionRoles";
import loggingSchema from "../models/GuildConfig/Logging";
import levels from "../models/Users/levels";
import voteSchema from "../models/Users/voteStorage";

const SUCCESS_EMOJI_ID = "817905283547267122";

export default class Util {
    public readonly client: Bot;

    private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
    private readonly no: string[] = ["no", "nope", "nada"];

    constructor(client: Bot) {
        this.client = client;
    }

    async hasVoted(user: string) {
        if (!user) {
            throw new TypeError("You need to pass in a user ID.");
        }

        let test = false;

        const date = this.client.userVotes[user];
        if (!date) {
            return false;
        }

        if (date + ms("12h") < Date.now()) {
            delete this.client.userVotes[user];
            test = true;
        }

        const schema = await voteSchema.findOne({ userID: user });
        if(test) {
            if(schema && schema.date + ms("12h") < Date.now()) {
                await schema.delete()
                return false;
            } else {
                return true;
            }
        }


    }

    /* Level stuff start */

    async createUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const isUser = await levels.findOne({ userID: userId, guildID: guildId });
        if (isUser) return false;

        const newUser = new levels({
            userID: userId,
            guildID: guildId,
        });

        await newUser
            .save()
            .catch((e) => console.log(`Failed to create user: ${e}`));

        return newUser;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     */

    async deleteUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        await levels
            .findOneAndDelete({ userID: userId, guildID: guildId })
            .catch((e) => console.log(`Failed to delete user: ${e}`));

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [xp] - Amount of xp to append.
     */

    async appendXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp)))
            throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });

        if (!user) {
            const newUser = new levels({
                userID: userId,
                guildID: guildId,
                xp: xp,
                level: Math.floor(0.1 * Math.sqrt(xp)),
            });

            await newUser
                .save()
                .catch((_e) => console.log(`Failed to save new user.`));

            return Math.floor(0.1 * Math.sqrt(xp)) > 0;
        }

        user.xp += parseInt(xp, 10);
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        await user.save().catch((e) => console.log(`Failed to append xp: ${e}`));

        return Math.floor(0.1 * Math.sqrt((user.xp -= xp))) < user.level;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param levelss
     */

    async appendLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level += parseInt(levelss, 10);
        user.xp = user.level * user.level * 100;
        user.lastUpdated = new Date();

        user.save().catch((e) => console.log(`Failed to append level: ${e}`));

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [xp] - Amount of xp to set.
     */

    async setXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp)))
            throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.xp = xp;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        user.save().catch((e) => console.log(`Failed to set xp: ${e}`));

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param guildId
     * @param level
     */

    async setLevel(userId, guildId, level) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!level) throw new TypeError("A level was not provided.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level = level;
        user.xp = level * level * 100;
        user.lastUpdated = new Date();

        user.save().catch((e) => console.log(`Failed to set level: ${e}`));

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param fetchPosition
     */

    async fetch(userId, guildId, fetchPosition = false) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user = await levels.findOne({
            userID: userId,
            guildID: guildId,
        });
        if (!user) {
            return null;
        } else if(!fetchPosition) {
             return user;
        }


        if (fetchPosition === true) {
            const leaderboard = await levels
                .find({
                    guildID: guildId,
                })
                .sort([["xp", "descending"]])
                .exec();

            // @ts-ignore
            user.position = leaderboard.findIndex((i) => i.userID === userId) + 1;
        }

        /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
        // @ts-ignore
        user.cleanXp = user.xp - this.xpFor(user.level);
        // @ts-ignore
        user.cleanNextLevelXp = this.xpFor(user.level + 1) - this.xpFor(user.level);

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [xp] - Amount of xp to subtract.
     */

    async subtractXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp)))
            throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.xp -= xp;
        user.level = Math.floor(0.1 * Math.sqrt(user.xp));
        user.lastUpdated = new Date();

        user.save().catch((e) => console.log(`Failed to subtract xp: ${e}`));

        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param levelss
     */

    async subtractLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = await levels.findOne({ userID: userId, guildID: guildId });
        if (!user) return false;

        user.level -= levelss;
        user.xp = user.level * user.level * 100;
        user.lastUpdated = new Date();

        user.save().catch((e) => console.log(`Failed to subtract levels: ${e}`));

        return user;
    }

    /**
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [limit] - Amount of maximum enteries to return.
     */

    async fetchLeaderboard(guildId, limit) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!limit) throw new TypeError("A limit was not provided.");

        let users = await levels
            .find({ guildID: guildId })
            .sort([["xp", "descending"]])
            .exec();

        return users.slice(0, limit);
    }

    /**
     * @param {string} [client] - Your Discord.CLient.
     * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
     * @param fetchUsers
     */

    async computeLeaderboard(client, leaderboard, fetchUsers = false) {
        if (!client) throw new TypeError("A client was not provided.");
        if (!leaderboard) throw new TypeError("A leaderboard id was not provided.");

        if (leaderboard.length < 1) return [];

        const computedArray = [];

        if (fetchUsers) {
            for (const key of leaderboard) {
                const user = (await client.users.fetch(key.userID)) || {
                    username: "Unknown",
                    discriminator: "0000",
                };
                computedArray.push({
                    guildID: key.guildID,
                    userID: key.userID,
                    xp: key.xp,
                    level: key.level,
                    position:
                        leaderboard.findIndex(
                            (i) => i.guildID === key.guildID && i.userID === key.userID
                        ) + 1,
                    username: user.username,
                    discriminator: user.discriminator,
                });
            }
        } else {
            leaderboard.map((key) =>
                computedArray.push({
                    guildID: key.guildID,
                    userID: key.userID,
                    xp: key.xp,
                    level: key.level,
                    position:
                        leaderboard.findIndex(
                            (i) => i.guildID === key.guildID && i.userID === key.userID
                        ) + 1,
                    username: client.users.cache.get(key.userID)
                        ? client.users.cache.get(key.userID).username
                        : "Unknown",
                    discriminator: client.users.cache.get(key.userID)
                        ? client.users.cache.get(key.userID).discriminator
                        : "0000",
                })
            );
        }

        return computedArray;
    }

    /*
     * @param {number} [targetLevel] - Xp required to reach that level.
     */
    xpFor(targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10)))
            throw new TypeError("Target level should be a valid number.");
        if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
        if (targetLevel < 1)
            throw new RangeError("Target level should be a positive number.");
        return targetLevel * targetLevel * 100;
    }

    /* Level stuff end*/



    formatNumber(number, minimumFractionDigits = 0) {
        return Number.parseFloat(number).toLocaleString(undefined, {
            minimumFractionDigits,
            maximumFractionDigits: 2,
        });
    }

    // Reaction Roles

    async reactionCreate(
        guildId: string,
        msgid: string,
        roleid: string,
        emoji: string,
        dm: boolean = false,
        option: number = 1
    ) {
        if (!this.client) throw new TypeError("An client was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!msgid) throw new TypeError("A message id was not provided.");
        if (!emoji) throw new TypeError("A reaction/emoji was not provided.");
        if (!roleid) throw new TypeError("A role id was not provided.");
        if (!option) option = 1;

        dm = dm ? dm : false;

        const issame = await serverset.findOne({
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
            roleid: roleid,
        });

        if (issame) return false;

        const newRR = new serverset({
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
            roleid: roleid,
            dm: dm,
            option: option,
        });

        await newRR
            .save()
            .catch((e) => console.log(`Failed to create reaction role: ${e}`));

        this.client.react.set(msgid + emoji, {
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
            roleid: roleid,
            dm: dm,
            option: option,
        });

        return newRR;
    }

    async awaitPlayers(msg, max, min = 1) {
        if (max === 1) return [msg.author.id];
        const addS = min - 1 === 1 ? "" : "s";
        await msg.channel.send(
            `You will need at least **${min - 1}** more player${addS} (at max **${
                max - 1
            }**). To join, type \`join game\`.`
        );

        const joined = [];
        joined.push(msg.author.id);

        const filter = async (res) => {
            if (res.author.bot) {
              return false;
            }

            if (joined.includes(res.author.id)) {
              return false
            }

            if (res.content.toLowerCase() !== "join game") {
              return false;
            }

            joined.push(res.author.id);
            await this.reactIfAble(res, res.author, SUCCESS_EMOJI_ID, "✅");

            return true;
        };
        
        const verify = await msg.channel.awaitMessages((msg) => filter(msg), {
            max: max - 1,
            time: 60000,
        });
        
        verify.set(msg.id, msg);
        return verify.size < min ? false : verify.map((player) => player.author.id);
    }


    async reactIfAble(msg, user, emoji, fallbackEmoji) {
        const dm = !msg.guild;
        if (
            fallbackEmoji &&
            !dm &&
            !msg.channel.permissionsFor(user)?.has("USE_EXTERNAL_EMOJIS")
        ) {
            emoji = fallbackEmoji;
        }

        if (
            dm ||
            msg.channel
                .permissionsFor(user)
                ?.has(["ADD_REACTIONS", "READ_MESSAGE_HISTORY"])
        ) {
            try {
                await msg.react(emoji);
            } catch {
                return null;
            }
        }
        return null;
    }


    async reactionDelete(guildId, msgid: string, emoji: string) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!msgid) throw new TypeError("A message id was not provided.");
        if (!emoji) throw new TypeError("A reaction/emoji was not provided.");

        const reactionRole = await serverset.findOne({
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
        });
        if (!reactionRole) return false;

        await serverset
            .findOneAndDelete({
                guildID: guildId,
                msgid: msgid,
                reaction: emoji,
                option: reactionRole.option,
            })
            .catch((e) => console.log(`Failed to delete reaction: ${e}`));

        this.client.react.delete(msgid + emoji);

        return reactionRole;
    }

    async reactionEdit(
        guildId: string,
        msgid: string,
        newroleid: string,
        emoji: string,
        _newoption: number = 1
    ) {
        if (!this.client) throw new TypeError("An client was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!msgid) throw new TypeError("A message id was not provided.");
        if (!emoji) throw new TypeError("A reaction/emoji was not provided.");
        if (!newroleid) throw new TypeError("A role id was not provided.");
        const reactionRole = await serverset.findOne({
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
        });
        if (!reactionRole) return false;
        reactionRole.roleid = newroleid;

        await reactionRole
            .save()
            .catch((e) => console.log(`Failed to save new prefix: ${e}`));
        this.client.react.set(msgid + emoji, {
            guildID: guildId,
            msgid: msgid,
            reaction: emoji,
            roleid: newroleid,
            dm: reactionRole.dm,
            option: reactionRole.option,
        });
        return;
    }

    async reactionFetch(guildId: string, msgid: string, emoji: string) {
        if (!this.client) throw new TypeError("A client was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!this.client.fetchforguild.has(guildId)) {
            let allrole = await serverset
                .find({guildid: guildId})
                .sort([["guildid", "descending"]])
                .exec();
            let i = 0;
            for (i; i < Object.keys(allrole).length; i++) {
                await this.client.react.set(allrole[i].msgid + allrole[i].reaction, {
                    guildID: allrole[i].guildID,
                    msgid: allrole[i].msgid,
                    reaction: allrole[i].reaction,
                    roleid: allrole[i].roleid,
                    dm: allrole[i].dm,
                });
            }
            this.client.fetchforguild.set(guildId, {
                guildid: guildId,
                totalreactions: Object.keys(allrole).length,
            });
        }
        return this.client.react.get(msgid + emoji);
    }

    async reactionFetchAll() {
        if (!this.client) throw new TypeError(`Client class inaccessible`);
        let all = await serverset
            .find({})
            .sort([["guildID", "descending"]])
            .exec();

        return all;
    }

    async checkPremium(user: string) {
        const check = await premium_schema.findOne({User: user});
        return !!check;

    }

    isCustomEmoji(emoji: string) {
        return emoji.split(":").length != 1;
    }

    async resolveLogChannel<T extends GuildChannel = TextChannel>(
        guildID: string,
        type: string
    ): Promise<T> {
        let data = await loggingSchema.findOne({
            type: type,
            guildID: guildID,
        });

        if (!data) return null;

        const channel = await this.client.channels.fetch(data.channelID);
        return channel as T;
    }

    formatDate(date: Date) {
        return new Intl.DateTimeFormat("en-US").format(date);
    }

    async createLogCh(message: Message, channelid: string, type: string) {
        const channel = (await this.client.channels.fetch(
            channelid
        )) as TextChannel;
        let fetchList = await loggingSchema.findOne({
            guildID: message.guild.id,
            type: type,
        });

        if (fetchList)
            return this.sendError(
                `There is already a log channel for \`${type}\``,
                message.channel
            );

        let findCh = await loggingSchema.findOne({
            channelID: channelid,
        });

        if (findCh) {
            await loggingSchema.findOneAndUpdate(
                {
                    channelID: channelid,
                },
                {
                    $push: {
                        type: type,
                    },
                }
            );
        } else {
            const data = new loggingSchema({
                guildname: message.guild.name,
                guildID: message.guild.id,
                channelName: channel.name,
                channelID: channelid,
                type: type,
            });

            data.save().catch((err) => {
                return this.sendError(
                    `An error has occurred while saving data\n\`${err.message}\``,
                    message.channel
                );
            });
        }

        return this.succEmbed(
            `${channel} has successfully been set as a log channel for \`${type}\``,
            message.channel
        );
    }

    checkOwner(user: string) {
        return this.client.owners.includes(user);
    }

    async getMember(message: Message, toFind: string = "", msg: boolean = false) {
        toFind = toFind?.toLowerCase();

        let target;

        if (!toFind) {
            target = message.member;
        } else if (!Number.isNaN(+toFind)) {
            target = await message.guild.members.fetch(toFind);
        }

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            let member = await message.guild.members.fetch();
            target = member.find((member) => {
                return (
                    member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
                );
            });
        }

        if (!target && msg) {
            message.channel.send({
                embed: {
                    description: "I'm sorry! I couldn't locate that user!",
                    color: "RED",
                },
            });
        }

        if (target && target.id === this.client.user.id) {
            if (msg) {
                message.channel.send({
                    embed: {
                        description: "You cannot use commands on me!",
                        color: "RED",
                    },
                });
            } else {
                return null;
            }
        }

        return target;
    }

    msConversion(millis: number) {
        let sec: any = Math.floor(millis / 1000);
        let hrs: any = Math.floor(sec / 3600);
        sec -= hrs * 3600;
        let min: any = Math.floor(sec / 60);
        sec -= min * 60;

        sec = "" + sec;
        sec = ("00" + sec).substring(sec.length);

        if (hrs > 0) {
            min = "" + min;
            min = ("00" + min).substring(min.length);
            return hrs + ":" + min + ":" + sec;
        } else {
            return min + ":" + sec;
        }
    }

    async verify(
        channel: any,
        user: User | GuildMember,
        {
            time = 30000,
            extraYes = [],
            extraNo = [],
        }: { time?: number; extraYes?: string[]; extraNo?: string[] }
    ) {
        // refactoring magic by anthony#8577 (developer of the suggestions bot) - removing this comment is NOT allowed
        const [yes, no] = [
            [...this.yes, ...extraYes],
            [...this.no, ...extraNo],
        ];

        const filter = (res: Message): boolean => {
            const value = res.content.toLowerCase();
            return (
                (user ? res.author.id === user.id : true) &&
                (yes.includes(value) || no.includes(value))
            );
        };

        const verify = await channel.awaitMessages(filter, {
            max: 1,
            time,
        });
        if (!verify.size) return 0;
        const choice = verify.first()?.content.toLowerCase();
        if (yes.includes(choice)) return true;
        if (no.includes(choice)) return false;
        return false;
    }

    async resolvePrefix(guildID: string) {
        const guildData = await guild_schema.findOne({guildID});
        const guild = this.client.guilds.cache.get(guildID);

        if (guild && guildData) {
            const prefix = guildData.prefix;

            if (prefix) return prefix;
        }

        return "!";
    }

    removeDuplicates<T>(arr: T[]) {
        return [...new Set(arr)];
    }

    capitalise(string: string) {
        if (string)
            return string
                .split(" ")
                .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
                .join(" ");
    }

    commands() {
        return this.client.commands;
    }

    formatPerms(perm: string) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, " ")
            .replace(/Guild/g, "Server")
            .replace(/Use Vad/g, "Use Voice Activity");
    }

    async categoryCheck(category: string, message: Message) {
        if (message.channel.type === "dm") return;
        category = category?.toLowerCase();
        const modRoleData: Array<string> = await this.resolveModRole(
            message.guild.id
        );
        const adminRoleData: Array<string> = await this.resolveAdminRole(
            message.guild.id
        );
        const ownerCheck = this.checkOwner(message.author.id);
        switch (category) {
            case "development":
                return ownerCheck;
            case "giveaways":
                return message.member.hasPermission("MANAGE_MESSAGES");
            case "reaction roles":
                if (message.member.permissions.has("MANAGE_MESSAGES")) return true;
                let c = false;
                if (modRoleData && modRoleData.length) {
                    modRoleData.forEach((mod) => {
                        if (message.member.roles.cache.has(mod)) {
                            c = true;
                        }
                    });
                }
                return c;
            case "moderation":
                if (message.member.permissions.has("MANAGE_MESSAGES")) return true;
                let a = false;
                if (modRoleData && modRoleData.length) {
                    modRoleData.forEach((mod) => {
                        if (message.member.roles.cache.has(mod)) {
                            a = true;
                        }
                    });
                }
                return a;
            case "administrative":
                if (message.member.permissions.has("ADMINISTRATOR")) return true;
                let b = false;
                if (adminRoleData && adminRoleData.length) {
                    adminRoleData.forEach((admin) => {
                        if (message.member.roles.cache.has(admin)) {
                            b = true;
                        }
                    });
                }
                return b;
            case "advertising":
                if (message.member.permissions.has("MANAGE_CHANNELS")) return true;
                let d = false;
                if (modRoleData && modRoleData.length) {
                    modRoleData.forEach((mod) => {
                        if (message.member.roles.cache.has(mod)) {
                            d = true;
                        }
                    });
                }
                return d;
            case "nsfw":
                return message.channel?.nsfw && !ownerCheck;
            case "roblox":
                return message.member.hasPermission("MANAGE_MESSAGES");
            default:
                return true;
        }
    }

    async resolveModRole(guildID: string) {
        const guildData2 = await guild_schema.findOne({Guild: guildID});
        const guild = this.client.guilds.cache.get(guildID);
        if (guild && guildData2) {
            let arrayOf: Array<string> = [];
            for (const mod of guildData2.ModRole) {
                let role = guild.roles.cache.get(mod);
                if (role) arrayOf.push(role.id);
            }
            if (arrayOf) return arrayOf;
        }
        return null;
    }

    async resolveAdminRole(guildID: string) {
        const guildData2 = await guild_schema.findOne({Guild: guildID});
        const guild = this.client.guilds.cache.get(guildID);
        let arrayOf: Array<string> = [];
        if (guild && guildData2) {
            for (const admin of guildData2.AdminRole) {
                let role = guild.roles.cache.get(admin);
                if (role) arrayOf.push(role.id);
            }
            if (arrayOf) return arrayOf;
        }
        return null;
    }

    trimArray(arr: Array<string>, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
    }

    getFlags(args: string[]): { flag: string; index: number }[] {
        const set = new Set();
        const res: { flag: string; index: number }[] = [];
        args.forEach((arg, index) => {
            if (!/^--?\w+$/.test(arg)) return;

            if (/^-\w+$/.test(arg)) {
                const flags = arg
                    .slice(1)
                    .split("")
                    .map((flag) => {
                        if (set.has(flag)) return;

                        set.add(flag);

                        return {
                            flag,
                            index,
                        };
                    })
                    .filter(($) => !!$);

                //@ts-ignore
                res.push(...flags);
            } else if (/^--\w+$/.test(arg)) {
                const flag = arg.slice(2);

                if (set.has(flag)) return;

                set.add(flag);

                res.push({
                    flag,
                    index,
                });
            } else throw new TypeError(`Invalid flag format: '${arg}'`);
        });
        return res;
    }

    getRoles(s: string, guild: Guild) {
        if (/^[0-9]+$/.test(s)) return guild.roles.cache.get(s);
        else if (/^<@&[0-9]+>$/.test(s)) {
            const id = s.substring(3, s.length - 1);
            return guild.roles.cache.get(id);
        }

        const allRoles = guild.roles.cache.map((m) => m.name);

        const result = new FuzzySearch(allRoles, {
            isCaseSensitive: false,
            includeScore: false,
            shouldSort: true,
            includeMatches: true,
            findAllMatches: false,
            minMatchCharLength: 1,
            location: 0,
            threshold: 0.6,
            distance: 100,
            useExtendedSearch: false,
            ignoreLocation: false,
            ignoreFieldNorm: false,
        }).search(s);

        const [match] = result;

        if (!match) return null;

        const main = guild.roles.cache.find(
            (m) => m.name.toLowerCase() === match.item.toLowerCase()
        );

        return main;
    }

    async sendError(text: string, channel, command: string = "") {
        if (channel.type !== "text") return;
        let message: string;
        if (!command) message = `Run !help [command] for extra help. | Vade`;
        if (command) message = `Run !help ${command} for extra help. | Vade`;
        let error = new MessageEmbed()
            .setTitle("Error!")
            .setDescription(text)
            .setColor("be0325")
            .setFooter(message);
        await channel.send(error);
    }

    async succEmbed(text: string, channel) {
        if (channel.type !== "text") return;
        let embed = new MessageEmbed()
            .setColor(`#a1ee33`)
            .setTitle("✅ Success!")
            .setDescription(text);
        channel.send(embed);
    }

    getChannels(s: string, guild: Guild) {
        if (/^[0-9]+$/.test(s)) {
            const channel = guild.channels.cache.get(s);
            if (
                !channel ||
                ["dm", "voice", "category", "store", "stage"].includes(channel.type)
            )
                return;
            return channel;
        } else if (/^<#[0-9]+>$/.test(s)) {
            const id = s.substring(2, s.length - 1);
            const channel = guild.channels.cache.get(id);
            if (
                !channel ||
                ["dm", "voice", "category", "store"].includes(channel.type)
            )
                return;
            return channel;
        }

        return guild.channels.cache.find(
            (x) => x.type === "text" && x.name.toLowerCase() === s
        );
    }

    validateHex(hex) {
        const regex = /^#[0-9A-F]{6}$/i;
        return regex.test(hex);
    }

    streamToArray(stream) {
        if (!stream.readable) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            const array = [];

            function onData(data) {
                array.push(data);
            }

            function onEnd(error) {
                if (error) reject(error);
                else resolve(array);
                cleanup();
            }

            function onClose() {
                resolve(array);
                cleanup();
            }

            function cleanup() {
                stream.removeListener("data", onData);
                stream.removeListener("end", onEnd);
                stream.removeListener("error", onEnd);
                stream.on("close", onClose);
            }
        });
    }

    async applyMultiplier(_user) {
    }

    async getMultipliers(_user) {
    }
}

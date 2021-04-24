import { Bot } from "client/Client";
import {
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  TextChannel,
  User,
} from "discord.js";

import premium_schema from "../../models/premium_schema";
import guild_schema from "../../models/guild";
import economy_schema from "../../models/economy";

export default class Util {
  public readonly client: Bot;
  private readonly yes: string[] = ["yes", "si", "yeah", "ok", "sure"];
  private readonly no: string[] = ["no", "nope", "nada"];
  constructor(client: Bot) {
    this.client = client;
  }

  async checkPremium(user: string) {
    const check = await premium_schema.findOne({ User: user });
    if (check) return true;
    return false;
  }

  checkOwner(user: string) {
    return this.client.owners.includes(user);
  }

  async getMember(message: Message, toFind: string = "", msg: boolean = false) {
    toFind = toFind.toLowerCase();

    let target = message.guild.members.cache.get(toFind);

    if (!toFind) {
      target = message.member;
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

    return target;
  }

  async verify(
    channel: TextChannel,
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
    const guildData = await guild_schema.findOne({ guildID });
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
    const modRoleData = await this.resolveModRole(message.guild.id);
    const adminRoleData = await this.resolveAdminRole(message.guild.id);
    const ownerCheck = this.checkOwner(message.author.id);
    switch (category) {
      case "development":
        return ownerCheck;
      case "giveaways":
        return message.member.hasPermission("MANAGE_MESSAGES");
      case "reaction roles":
        return (
          (message.member.hasPermission("MANAGE_MESSAGES") ||
            message.member.roles.cache.has(modRoleData)) &&
          !ownerCheck
        );
      case "moderation":
        return (
          (message.member.hasPermission("MANAGE_MESSAGES") ||
            message.member.roles.cache.has(modRoleData)) &&
          !ownerCheck
        );
      case "administrative":
        return (
          (message.member.hasPermission("BAN_MEMBERS") ||
            message.member.roles.cache.has(adminRoleData)) &&
          !ownerCheck
        );
      case "advertising":
        return (
          (message.member.hasPermission("MANAGE_CHANNELS") ||
            message.member.roles.cache.has(modRoleData)) &&
          !ownerCheck
        );
      case "nsfw":
        return message.channel?.nsfw && !ownerCheck;
      case "tch":
        return message.guild.id === "779760518428229632" && !ownerCheck;
      case "roblox":
        return message.member.hasPermission("MANAGE_MESSAGES");
      default:
        return true;
    }
  }

  async resolveModRole(guildID: string) {
    const guildData2 = await guild_schema.findOne({ Guild: guildID });
    const guild = this.client.guilds.cache.get(guildID);
    if (guild && guildData2) {
      const role = guild.roles.cache.get(guildData2.ModRole);
      if (role) return role.id;
    }
    return null;
  }

  async resolveAdminRole(guildID: string) {
    const guildData2 = await guild_schema.findOne({ Guild: guildID });
    const guild = this.client.guilds.cache.get(guildID);
    if (guild && guildData2) {
      const role = guild.roles.cache.get(guildData2.AdminRole);
      if (role) return role.id;
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

    return guild.roles.cache.find(
      (x) => x.name.toLowerCase() === s.toLowerCase()
    );
  }

  getChannels(s, guild) {
    if (/^[0-9]+$/.test(s)) {
      const channel = guild.channels.cache.get(s);
      if (!channel || ['dm', 'voice', 'category', 'store', 'stage'].includes(channel.type)) return;
      return channel;
    } else if (/^<#[0-9]+>$/.test(s)) {
      const id = s.substring(2, s.length - 1);
      const channel = guild.channels.cache.get(id);
      if (!channel || ['dm', 'voice', 'category', 'store'].includes(channel.type)) return;
      return channel;
    }

    return guild.channels.cache.find(x => (x.type === 'text') && x.name.toLowerCase() === s);
  }

  async addBal(user: string, Coins: Number) {
    if (!user) throw new TypeError(`No user property provided.`);
    if (!Coins) throw new TypeError(`No Coins property provided.`);
    const locate_schema = await economy_schema.findOne({ User: user });
    if (locate_schema) {
      await economy_schema.updateOne({
        User: user,
        $inc: { Wallet: Coins },
      });
    } else {
      const newSchema = new economy_schema({
        User: user,
        Wallet: Coins,
        Bank: 0,
      });

      await newSchema.save();
    }
  }
}

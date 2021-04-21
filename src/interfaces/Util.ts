import { Bot } from "client/Client";
import { GuildChannel, Message, TextChannel } from "discord.js";

import premium_schema from "../../models/premium_schema";
import Guild from "../../models/guild";

export default class Util {
  public readonly client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  async checkPremium(user: string) {
    const check = await premium_schema.findOne({ User: user });
    if (check) return true;
    return false;
  }

  checkOwner(user: string) {
    if (!this.client.owners.includes(user)) return false;
    return true;
  }

  async getMember(message: Message, toFind: string = "", msg: boolean) {
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
          description: "Im Sorry. But I Can't Find That User!",
          color: "RED",
        },
      });
    }

    return target;
  }

  async resolvePrefix(guildID: string) {
    const guildData = await Guild.findOne({ guildID });
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
    return string
      .split(' ')
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(' ');
  }

  formatPerms(perm: string) {
    return perm
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
      .replace(/_/g, ' ')
      .replace(/Guild/g, 'Server')
      .replace(/Use Vad/g, 'Use Voice Activity');
  }

  async categoryCheck(category: string, message: Message) {
      if(message.channel.type === 'dm') return;
    category = category.toLowerCase();
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

  asy
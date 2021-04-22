import { RunFunction } from "../../interfaces/Command";
import moment from "moment";

const filterLevels = {
  DISABLED: "Off",
  MEMBERS_WITHOUT_ROLES: "No Role",
  ALL_MEMBERS: "Everyone",
};

const verificationLevels = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "(╯°□°）╯︵ ┻━┻",
  VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
};

const regions = {
  brazil: "Brazil",
  europe: "Europe",
  hongkong: "Hong Kong",
  india: "India",
  japan: "Japan",
  russia: "Russia",
  singapore: "Singapore",
  southafrica: "South Africa",
  sydeny: "Sydeny",
  "us-central": "US Central",
  "us-east": "US East",
  "us-west": "US West",
  "us-south": "US South",
};

export const run: RunFunction = async (client, message, args) => {
  const roles = message.guild.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((role) => role.toString());

  const members = message.guild.members.cache;
  const channels = message.guild.channels.cache;
  const emojis = message.guild.emojis.cache;
  const embed = new client.embed()
    .setDescription(`**Guild information for __${message.guild.name}__**`)
    .setMainColor()
    .setThumbnail(message.guild.iconURL())
    .setBlankField()
    .addField("__General__", [
      "",
      `**❯** Guild Name: **${message.guild.name}**`,
      `**❯** Guild ID: **${message.guild.id}**`,
      `**❯** Guild Owner: **${
        message.guild.owner.user ? message.guild.owner.user.tag : "Unavailable."
      } (${message.guild.ownerID})**`,
      `**❯** Guilds Region: **${regions[message.guild.region]}**`,
      `**❯** Current Boost Tier: **${
        message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : "N/A"
      }**`,
      `**❯** Explicit Filter: **${
        filterLevels[message.guild.explicitContentFilter]
      }**`,
      `**❯** Guilds Verification Level: **${
        verificationLevels[message.guild.verificationLevel]
      }**`,
      `**❯** Creation Date: **${moment(message.guild.createdAt).format(
        "LL"
      )} ${moment(message.guild.createdTimestamp).fromNow()}**`,
    ])
    .setBlankField()
    .addField("__Statistics__", [
      `**❯** Role Count: **${roles.length}**`,
      `**❯** Emoji Count: **${emojis.size}**`,
      `**❯** Regular Emoji Count: **${
        emojis.filter((emoji) => !emoji.animated).size
      }**`,
      `**❯** Animation Emoji Count: **${
        emojis.filter((emoji) => emoji.animated).size
      }**`,
      `**❯** Member Count: **${message.guild.memberCount}**`,
      ,
      `**❯** Humans: **${members.filter((member) => !member.user.bot).size}**`,
      `**❯** Bots: **${members.filter((member) => member.user.bot).size}**`,
      `**❯** Text Channels: **${
        channels.filter((channel) => channel.type === "text").size
      }**`,
      `**❯** Voice Channels: **${
        channels.filter((channel) => channel.type === "voice").size
      }**`,
      `**❯** Boost Count: **${message.guild.premiumSubscriptionCount || "0"}**`,
    ])
    .setBlankField()
    .addField("__Presence__", [
      `**❯** Online: **${
        members.filter((member) => member.presence.status === "online").size
      }**`,
      `**❯** Idle: **${
        members.filter((member) => member.presence.status === "idle").size
      }**`,
      `**❯** Do Not Disturb: **${
        members.filter((member) => member.presence.status === "dnd").size
      }**`,
      `**❯** Offline: **${
        members.filter((member) => member.presence.status === "offline").size
      }**`,
    ])
    .addField(
      `Roles [${roles.length - 1}]`,
      roles.length < 10
        ? roles.join(", ")
        : roles.length > 10
        ? client.utils.trimArray(roles)
        : "None"
    )
    .setTimestamp();

  message.channel.send(embed);
};

export const name: string = "serverinfo";
export const aliases: string[] = ["si"];
export const category: string = "Information";

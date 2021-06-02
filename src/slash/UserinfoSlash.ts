import { SlashCommand, OptionType } from "../Classes/types";
import moment from "moment";
import { Guild, GuildMember } from "discord.js";

const flags = {
  DISCORD_EMPLOYEE: "Discord Employee",
  DISCORD_PARTNER: "Discord Partner",
  BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
  BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
  HYPESQUAD_EVENTS: "HypeSquad Events",
  HOUSE_BRAVERY: "House of Bravery",
  HOUSE_BRILLIANCE: "House of Brilliance",
  HOUSE_BALANCE: "House of Balance",
  EARLY_SUPPORTER: "Early Supporter",
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: "Verified Bot",
  VERIFIED_DEVELOPER: "Verified Bot Developer",
};

export default {
  name: "userinfo",
  description: "View information on a specific user.",
  options: [
    {
      type: OptionType.USER,
      name: "user",
      description: "Person to get information on.",
      required: true,
    },
  ],
  async execute(client, interaction, methods) {
    const fetchMember = Object.keys(interaction.data.resolved.members)[0];
    const fetchGuild = await client.guilds.fetch(interaction.guild_id);
    console.log(`GUILD: ` + fetchGuild);
    console.log(`Member:` + fetchMember);
    const member = await fetchGuild.members.fetch(fetchMember.toString());
    console.log(`GUILD MEMBER: ` + member);

    const roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);
    const userFlags = member.user.flags ? member.user.flags.toArray() : [];
    const embed = new client.embed()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor(member.displayHexColor || "BLUE")
      .addField("User", [
        `\u200b`,
        `**❯** Username: **${member.user.username}**`,
        `**❯** User Tag: **${member.user.discriminator}**`,
        `**❯** Discord ID: **${member.id}**`,
        `**❯** Flags: **${
          userFlags.length
            ? userFlags.map((flag) => flags[flag]).join(", ")
            : "None."
        }**`,
        `**❯** Avatar: **[Link to avatar](${member.user.displayAvatarURL({
          dynamic: true,
        })})**`,
        `**❯** Time Created:** ${moment(member.user.createdTimestamp).format(
          "LT"
        )} ${moment(member.user.createdTimestamp).format("LL")} ${moment(
          member.user.createdTimestamp
        ).fromNow()}**`,
        `**❯** Status: **${member.user.presence.status}**`,
        `**❯** Game: **${
          member.user.presence.activities[0]
            ? member.user.presence.activities[0].name
            : "N/A"
        }**`,
        `\u200b`,
      ])
      .addField("Member", [
        `\u200b`,
        `**❯** Highest Role:** ${
          member.roles?.highest.id === interaction.guild_id
            ? "None"
            : member.roles?.highest.name
        }**`,
        `**❯** Server Join Date:** ${moment(member.joinedAt).format(
          "LL LTS"
        )}**`,
        `**❯** Current Hoisted Role:** ${
          member.roles?.hoist ? member.roles?.hoist.name : "None"
        }**`,
        `**❯** Member Roles: **[${roles.length}]:**  ${
          roles.length < 10
            ? roles.join(", ")
            : roles.length > 10
            ? client.utils.trimArray(roles)
            : "None"
        }`,
        `\u200b`,
      ]);

    methods.respond({
      content: `User information for ${member.user.tag}`,
      embeds: [embed.toJSON()],
    });
  },
} as SlashCommand;

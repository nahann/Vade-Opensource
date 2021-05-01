import { SlashCommand, OptionType } from "../Classes/types";
import moment from 'moment';
import { Permissions } from "discord.js";

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
    name: "roleinfo",
    description: "View information on a specific role.",
    options: [
        {
            type: OptionType.ROLE,
            name: "role",
            description: "Role you wish to get information on.",
            required: true,
        },
    ],
    async execute(client, interaction, methods) {

        const fetchRole = Object.keys(interaction.data.resolved.roles)[0];
        const fetchGuild = await client.guilds.fetch(interaction.guild_id);
        console.log(`GUILD: ` + fetchGuild);
        console.log(`Role:` + fetchRole)
        const roleFind = await fetchGuild.roles.fetch(fetchRole.toString());
        console.log(`GUILD ROLE: ` + roleFind)

        const ArrayOfPerms = new Permissions(roleFind.permissions)
      .toArray()
      .map(client.utils.formatPerms);
    const checkOrCross = (bool) => (bool ? "✅" : "❎");

    const embed = new client.embed()
      .setDescription(`**Role information for __<@&${roleFind.id}>__**`)
      .setColor(roleFind.hexColor)
      .setThumbnail(fetchGuild.iconURL())
      .addField("General:", [
        `**❯ ID:** ${roleFind.id}`,
        `**❯ Colour:** ${roleFind.hexColor}`,
        `**❯ Members with role:** ${roleFind.members.size}`,
        `**❯ Position:** ${roleFind.position}`,
        `**❯ Time Created:** ${moment(roleFind.createdTimestamp).format(
          "LT"
        )} ${moment(roleFind.createdTimestamp).format("LL")} (${moment(
          roleFind.createdTimestamp
        ).fromNow()})`,
        `**❯ Permissions:** ${ArrayOfPerms.join(", ")}`,
      ])
      .addField("Other:", [
        `**❯ Mentionable:** ${checkOrCross(roleFind.mentionable)}`,
        `**❯ Hoisted:** ${checkOrCross(roleFind.hoist)}`,
        `**❯ Managed:** ${checkOrCross(roleFind.managed)}`,
      ]);
        
        methods.respond({
            content: `User information for **${roleFind.name}**.`,
            embeds: [embed.toJSON()]
        });
    },
} as SlashCommand;

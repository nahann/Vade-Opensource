import { SlashCommand, OptionType } from "../Classes/types";
import moment from "moment";
import { Permissions } from "discord.js-light";

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
    console.log(`Role:` + fetchRole);
    const roleFind = await fetchGuild.roles.fetch(fetchRole.toString());
    console.log(`GUILD ROLE: ` + roleFind);

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
      embeds: [embed.toJSON()],
    });
  },
} as SlashCommand;

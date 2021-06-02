import { RunFunction } from "../../interfaces/Command";
import moment from "moment";
import { Permissions } from "discord.js";

export const run: RunFunction = async (client, message, args) => {
  const roleFind = client.utils.getRoles(args[0], message.guild);
  if (!roleFind)
    return message.channel.send(
      `Unable to locate that role. Please try again.`
    );

  const ArrayOfPerms = new Permissions(roleFind.permissions)
    .toArray()
    .map(client.utils.formatPerms);
  const checkOrCross = (bool) => (bool ? "✅" : "❎");

  const embed = new client.embed()
    .setDescription(`**Role information for __<@&${roleFind.id}>__**`)
    .setColor(roleFind.hexColor)
    .setThumbnail(message.guild.iconURL())
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

  return message.channel.send(embed);
};
export const name: string = "roleinfo";
export const category: string = "Information";
export const description: string = "Gain information on the specified role.";
export const aliases: string[] = ["rinfo"];

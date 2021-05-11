import { TextChannel } from "discord.js-light";
import { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, oldRole, newRole) => {
  if (oldRole.rawPosition !== newRole.rawPosition) return;

  const logChannel = await client.utils.resolveLogChannel(
    oldRole.guild.id,
    "role"
  );
  if (!logChannel) {
    return;
  }

  const fetchLogs = await oldRole.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_UPDATE",
  });

  const log = fetchLogs.entries.first();
  const { executor } = log;

  const arr1 = oldRole.permissions.toArray();
  const arr2 = newRole.permissions.toArray();

  let difference = arr1
    .filter((x) => !arr2.includes(x))
    .concat(arr2.filter((x) => !arr1.includes(x)));

  let added = [];
  let removed = [];
  difference.forEach((diff) => {
    if (!arr1.includes(diff)) {
      added.push(diff);
    } else {
      removed.push(diff);
    }
  });

  let embed = new client.embed()
    .setColor("YELLOW")
    .setAuthor("Role Updated", oldRole.guild.iconURL())
    .setTitle(`@${oldRole.name}`)
    .setURL("https://vade-bot.com")
    .addField("Updated By:", executor?.tag, true)
    .setTimestamp();

  oldRole.name === newRole.name
    ? ""
    : embed.addField(
        "Role Name:",
        `\`${oldRole.name}\` -> \`${newRole.name}\``,
        true
      );

  oldRole.color === newRole.color
    ? ""
    : embed.addField(
        "Color:",
        `\`#${oldRole.color.toString(16)}\` -> \`#${newRole.color.toString(
          16
        )}\``,
        true
      );
  added.length
    ? embed.addField(
        "Added Perms:",
        `\`${prettifyPerm(added).join("`\n`")}\``,
        true
      )
    : "";
  removed.length
    ? embed.addField(
        "Removed Perms:",
        `\`${prettifyPerm(removed).join("`\n`")}\``,
        true
      )
    : "";

  return logChannel.send(embed);
};

export const name: string = "roleUpdate";

function prettifyPerm(arr) {
  return arr.map((perm) => {
    perm = perm.replace(/_/g, " ");
    return perm.charAt(0) + perm.substring(1).toLowerCase();
  });
}

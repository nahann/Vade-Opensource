import { User } from "discord.js";
import { Guild } from "discord.js";
import ms from "ms";
import { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, guild: Guild, user: User) => {
  const modLog = await client.utils.resolveLogChannel(guild.id, "moderation");
  if (!modLog) {
    return;
  }
  const auditEntry = await guild.fetchBan(user.id);
  let reason = auditEntry ? auditEntry.reason : "Unable to find a reason.";
  if (user.partial) await user.fetch();
  let bannedEmbed = new client.embed()
    .setTitle(`User Banned!`)
    .setDescription(
      `**❯** User Banned: ${user.tag} (${user.id})\n**❯** Time Banned: ${
        (ms(Date.now()), { long: true })
      }\n**❯** Reason: ${reason}`
    )
    .setClear()
    .setIcon(guild)
    .setTimestamp()
    .setFooter(`Vade Moderation`);
  modLog.send(bannedEmbed);
};
export const name: string = "guildBanAdd";

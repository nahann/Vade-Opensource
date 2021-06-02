import { RunFunction } from "../../interfaces/Command";
import { GuildMember } from "discord.js";

export const run: RunFunction = async (client, message, args) => {
  const member: GuildMember = await client.utils.getMember(
    message,
    args[0],
    true
  );
  if (!member || member.id === message.author.id)
    return client.utils.sendError(
      `You need to specify a member.`,
      message.channel
    );
  if (!member.voice.channel)
    return client.utils.sendError(
      `That member is not connected to a voice channel.`,
      message.channel
    );
  if (member.roles.highest.position > message.guild.me.roles.highest.position)
    return client.utils.sendError(
      `I cannot perform actions on users who's roles are higher than mine.`,
      message.channel
    );
  let reason = args.slice(1).join(" ").length
    ? args.slice(1).join(" ")
    : "No reason provided";
  if (member.voice.serverMute) {
    await member.voice.setDeaf(false, reason);
    return client.utils.succEmbed(
      `Successfully removed the voice deafen for ${member} with the reason: ${reason}.`,
      message.channel
    );
  }

  await member.voice.setDeaf(true, reason);

  return client.utils.succEmbed(
    `Successfully voice deafened ${member} with the reason: ${reason}.`,
    message.channel
  );
};
export const name: string = "voicedeafen";
export const category: string = "Moderation";
export const description: string = "Deafen a member from a command.";
export const aliases: string[] = ["vdeafen"];
export const userPerms: string[] = ["DEAFEN_MEMBERS"];
export const botPerms: string[] = ["DEAFEN_MEMBERS"];

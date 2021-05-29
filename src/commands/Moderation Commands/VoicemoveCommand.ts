import { RunFunction } from "../../interfaces/Command";
import { GuildMember } from "discord.js-light";

export const run: RunFunction = async (client, message, args) => {
  const member: GuildMember = await client.utils.getMember(
    message,
    args[0],
    true
  );
  if (!args[0] || !member)
    return client.utils.sendError(
      `You need to provide a valid member.`,
      message.channel
    );
  if (!member.voice.channel)
    return client.utils.sendError(
      `The provided member is not in a Voice Channel!`,
      message.channel
    );
  const channelID = args[1];
  if (!channelID || isNaN(parseInt(channelID)))
    return client.utils.sendError(
      `You need to provide a Voice Channel ID.`,
      message.channel
    );
  await message.guild.channels.fetch(channelID).then((channel) => {
    if (!channel)
      return client.utils.sendError(
        `Couldn't locate that channel, please try again!`,
        message.channel
      );
    if (channel.type !== "voice")
      return client.utils.sendError(
        `Please ensure that you specify a Voice Channel ID.`,
        message.channel
      );
    if (member.voice.channel.id === channel.id)
      return client.utils.sendError(
        `You cannot move a member if they're already in the VC you're trying to move them to.`,
        message.channel
      );
    if (!channel.permissionsFor(message.guild.me).has("MOVE_MEMBERS"))
      return client.utils.sendError(
        `I do not have permission to move members to that voice channel.`,
        message.channel
      );
    const reason = args[2] ? args.slice(2).join(" ") : "No reason provided";
    member.voice.setChannel(channel, reason);
    return client.utils.succEmbed(
      `Successfully moved ${member} to the voice channel: ${channel} With the reason of: ${reason}`,
      message.channel
    );
  });
};
export const name: string = "voicemove";
export const category: string = "Moderation";
export const description: string =
  "Move a member from one voice channel to another.";
export const aliases: string[] = ["vmove"];
export const botPerms: string[] = ["MOVE_MEMBERS"];
export const userPerms: string[] = ["MOVE_MEMBERS"];

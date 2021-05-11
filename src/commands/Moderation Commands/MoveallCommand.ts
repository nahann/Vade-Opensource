import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  if (!message.member.voice.channel)
    return message.reply(
      `You need to be in a Voice Channel in order to run this Command!`
    );

  const channel = args[0];

  if (!channel || isNaN(parseInt(channel)))
    return message.reply(`You need to specify a channel ID.`);

  const channelCheck = message.guild.channels.cache.get(channel);
  if (!channelCheck)
    return message.reply(
      `I couldn't locate the channel provided. Please try again.`
    );
  if (channelCheck.type !== "voice")
    return message.reply(
      `The channel provided is not a Voice Channel. Please try again.`
    );
  if (channelCheck.id === message.member.voice.channel.id)
    return message.reply(
      `You cannot move them to the exact same Voice Channel.`
    );
  const channelMembers = channelCheck.members;

  if (!channelMembers || !channelMembers.size || channelMembers.size < 0)
    return message.reply(
      `Nobody is in the Voice Channel provided. Please try again.`
    );

  for (const member of channelMembers) {
    const user = message.guild.members.cache.get(member[0]);
    if (user) {
      user.voice.setChannel(
        message.member.voice.channel,
        `Moveall Command was run by: ${message.author.tag}`
      );
    }
  }
};
export const name: string = "moveall";
export const category: string = "Moderation";
export const description: string =
  "Move all members from one VC to your current VC.";
export const aliases: string[] = ["mvall"];
export const botPerms: string[] = ["MOVE_MEMBERS", "MANAGE_CHANNELS"];
export const userperms: string[] = ["MOVE_MEMBERS"];
export const modCommand: boolean = true;

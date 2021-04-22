import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const mentioned = message.mentions.channels.first();

  const channel = mentioned ? mentioned : message.channel;
  if (!message.guild.channels.cache.get(channel.id))
    return message.channel.send(
      `You need to specify a channel in this Server.`
    );
  let text = channel ? args.slice(1).join(" ") : args.join(" ");

  channel.send(text);
};

export const name: string = "say";
export const devOnly: boolean = true;
export const usage: string = "!say <Optional channel> <Text>>";
export const category: string = "Development";

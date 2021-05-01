import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  // if first value is null default to second value
  const channel = message.mentions.channels.first() ?? message.channel;

  if (!message.guild.channels.cache.get(channel.id))
    return message.channel.send(
      `You need to specify a channel in this Server.`
    );

  const text = channel ? args.slice(1).join(" ") : args.join(" ");
  console.assert(channel, `test`);

  channel.send(text);
};

export const name: string = "say";
export const devOnly: boolean = true;
export const usage: string = "!say <Optional channel> <Text>>";
export const category: string = "Development";
export const description: string = "Have the Bot say something in an optional channel.";
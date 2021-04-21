import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const mentioned = message.mentions.channels.first();
  const channel = mentioned ? mentioned : message.channel;

  let text = channel ? args.slice(1).join(" ") : args.join(" ");

  channel.send(text);
};

export const name: string = "say";
export const devOnly: boolean = true;
export const usage: string = "!say <Optional channel> <Text>>";

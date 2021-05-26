import { Command, RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args, lang) => {
  if (!args.length)
    return client.utils.sendError(`No action provided.`, message.channel);
  let cmd = args[0]?.toLowerCase();
  let command: Command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command)
    return client.utils.sendError(`Invalid command.`, message.channel);
  try {
    args.shift();
    command.run(client, message, args, lang);
  } catch (e) {
    return client.utils.sendError(`Error: ${e}`, message.channel);
  }
};
export const name: string = "sudo";
export const category: string = "Development";
export const description: string =
  "Bypass Command requirements for dev purposes only.";
export const aliases: string[] = ["root"];
export const devOnly: boolean = true;

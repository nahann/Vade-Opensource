import { RunFunction } from "../../interfaces/Command";
import GuildConfigSchema from "../../../models/guild";

export const run: RunFunction = async (client, message, args) => {
  const GuildConfig = await GuildConfigSchema.findOne({
    Guild: message.guild.id,
  });
  if (!args.length)
    return message.channel.send(
      `The current prefix for this Guild is \`${
        (GuildConfig as any)?.Prefix || "ts!"
      }\``
    );
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send(
      `You are missing the \`ADMINISTRATOR\ Permission that is required for this action.`
    );
  if (args[0].length > 4)
    return message.channel.send(`The max length for Prefixes is 4 characters.`);
  await GuildConfigSchema.updateOne(
    { Guild: message.guild.id },
    { Prefix: args[0].toLowerCase() }
  );
  return message.channel.send(
    `Successfully updated your prefix. It is now \`${args[0].toLowerCase()}\``
  );
};

export const name: string = "prefix";
export const category: string = "utility";

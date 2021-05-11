import { RunFunction } from "../../interfaces/Command";
import GuildConfigSchema from "../../models/GuildConfig/guild";
import mongoose from "mongoose";

export const run: RunFunction = async (client, message, args) => {
  const GuildConfig = await GuildConfigSchema.findOne({
    guildID: message.guild.id,
  });
  if (!args.length)
    return message.channel.send(
      `The current prefix for this Guild is \`${
        (GuildConfig as any)?.prefix || "ts!"
      }\``
    );
  if (args[0].length > 4)
    return message.channel.send(`The max length for Prefixes is 4 characters.`);

    if(message.mentions.everyone || message.mentions.members.size >= 1) return message.channel.send(`Your prefix cannot contain a mention.`);

  if (!GuildConfig) {
    const newSchema = new GuildConfigSchema({
      _id: mongoose.Types.ObjectId(),
      guildID: message.guild.id,
      guildName: message.guild.name,
      prefix: args[0].toLowerCase(),
    });

    await newSchema.save();
    return message.channel.send(
      `Successfully updated your prefix. It is now \`${args[0].toLowerCase()}\``
    );
  }
  await GuildConfigSchema.updateOne({
    guildID: message.guild.id,
    prefix: args[0].toLowerCase(),
  });
  return message.channel.send(
    `Successfully updated your prefix. It is now \`${args[0].toLowerCase()}\``
  );
};

export const name: string = "prefix";
export const category: string = "Administrative";
export const aliases: string[] = ["setprefix", "sprefix"];
export const userPerms: string[] = ["ADMINISTRATOR"];

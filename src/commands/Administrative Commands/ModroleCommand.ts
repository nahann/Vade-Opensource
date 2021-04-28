import { RunFunction } from "../../interfaces/Command";
import guild_schema from "../../../models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  const locate_schema = await guild_schema.findOne({
    guildID: message.guild.id,
  });
  if (
    args[0] &&
    args[0].toLowerCase() === "remove" &&
    locate_schema &&
    locate_schema.ModRole
  ) {
    await locate_schema.updateOne({
      ModRole: null,
    });

    return message.channel.send(
      `Successfully removed your guilds moderator role.`
    );
  }
  if (!args[0])
    return message.channel.send(
      `Please ensure you specify either the role ID, name or mention.`
    );
  const role = client.utils.getRoles(args[0], message.guild);
  if (!role)
    return message.channel.send(
      `Couldn't locate the role. Please ensure you specify either the role ID, name or mention.`
    );

  if (!locate_schema) {
    const newSchema = new guild_schema({
      guildID: message.guild.id,
      guildName: message.guild.name,
      prefix: "ts!",
      modRole: role.id,
    });

    await newSchema.save();
    return message.channel.send(
      `Successfully set your guilds moderator role to: **${role.name}**.`
    );
  } else {
    await locate_schema.updateOne({
      ModRole: role.id,
    });

    return message.channel.send(
      `Successfully set your guilds moderator role to: **${role.name}**.`
    );
  }
};
export const name: string = "modrole";
export const category: string = "Administrative";
export const description: string = "Configure the guilds moderator role.";
export const aliases: string[] = ["mrole"];

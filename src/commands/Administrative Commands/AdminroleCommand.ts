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
    locate_schema.AdminRole
  ) {
    await locate_schema.updateOne({
      AdminRole: null,
    });

    return message.channel.send(
      `Successfully removed your guilds administrator role.`
    );
  }
  if (!args[0])
    return message.channel.send(
      `Please ensure you specify either the role ID, name or mention.`
    );
  const role = await client.utils.getRoles(args[0], message.guild);
  if (!role)
    return message.channel.send(
      `Couldn't locate the role. Please ensure you specify either the role ID, name or mention.`
    );

  if (!locate_schema) {
    const newSchema = new guild_schema({
      guildID: message.guild.id,
      guildName: message.guild.name,
      prefix: "ts!",
      AdminRole: role.id,
    });

    await newSchema.save();
    return message.channel.send(
      `Successfully set your guilds administrator role to: **${role.name}**.`
    );
  } else {
    await locate_schema.updateOne({
      AdminRole: role.id,
    });

    return message.channel.send(
      `Successfully set your guilds administrator role to: **${role.name}**.`
    );
  }
};
export const name: string = "adminrole";
export const category: string = "Administrative";
export const description: string = "Configure the guilds administrator role.";
export const aliases: string[] = ["arole"];
export const userPerms: string[] = ['MANAGE_GUILD'];

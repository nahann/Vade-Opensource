import { RunFunction } from "../../interfaces/Command";
import GuildConfig from "../../../src/models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  const locate_schema = await GuildConfig.findOne({
    guildID: message.guild.id,
  });
  if (!locate_schema)
    return client.utils.sendError(
      `Looks like something went wrong when trying to locate your servers data.`,
      message.channel
    );

  if (
    !args[0] ||
    (args[0]?.toLowerCase() !== "enable" &&
      args[0]?.toLowerCase() !== "disable")
  )
    return client.utils.sendError(
      `You must specify either 'enable' or 'disable'.`,
      message.channel
    );
  const type = args[0]?.toLowerCase() === "enable";
  if (type) {
    if (locate_schema.cleanCommands)
      return client.utils.sendError(
        `You already have clean commands enabled for this server.`,
        message.channel
      );

    await locate_schema.updateOne({
      cleanCommands: true,
    });

    return client.utils.succEmbed(
      `Successfully enabled clean commands for this server!`,
      message.channel
    );
  } else {
    if (!locate_schema.cleanCommands)
      return client.utils.sendError(
        `Clean commands are not enabled for this server and therefore cannot be disabled.`,
        message.channel
      );

    await locate_schema.updateOne({
      cleanCommands: false,
    });

    return client.utils.succEmbed(
      `Successfully disabled clean commands for this server!`,
      message.channel
    );
  }
};
export const name: string = "clean";
export const category: string = "Administrative";
export const description: string =
  "Configure the cleanCommands setting for the guild.";
export const aliases: string[] = ["cleancommands", "autoclean"];
export const userPerms: string[] = ["MANAGE_GUILD"];
export const botPerms: string[] = ["MANAGE_MESSAGES"];

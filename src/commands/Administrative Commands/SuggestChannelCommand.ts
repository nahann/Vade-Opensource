import { RunFunction } from "../../interfaces/Command";
import guild_data from "../../../models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  const channel = client.utils.getChannels(args[0], message.guild);
  const check_data = await guild_data.findOne({ guildID: message.guild.id });
  if (!channel && args[0].toLowerCase() !== "remove")
    return message.channel.send(
      `Please either specify a channel name, ID or mention. Or "remove".`
    );
  if (channel && check_data) {
    if (!channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES"))
      return message.channel.send(
        `Please ensure I have permission to manage messages in the specified channel.`
      );
    await check_data.updateOne({
      Suggestion: channel.id,
    });

    return message.channel.send(
      `Successfully updated your configured suggestion channel.`
    );
  } else if (
    check_data &&
    check_data.Suggestion &&
    args[0].toLowerCase() === "remove"
  ) {
    await check_data.updateOne({
      Suggestion: null,
    });

    return message.channel.send(
      `Successfully removed your configured suggestion channel.`
    );
  } else if (!check_data && channel) {
    const newData = new guild_data({
      guildID: message.guild.id,
      guildName: message.guild.name,
      Suggestion: channel.id,
      prefix: "!",
    });

    await newData.save();
    return message.channel.send(
      `Successfully updated your configured suggestion channel.`
    );
  } else if (!check_data && args[0].toLowerCase() === "remove")
    return message.channel.send(
      `You have no suggestion channel configured for this server.`
    );
};
export const name: string = "suggestionchannel";
export const category: string = "Administrative";
export const description: string = "Configure the Guilds suggestions channel.";
export const userPerms: string[] = ["MANAGE_GUILD"];
export const botPerms: string[] = ["MANAGE_ROLES", "MANAGE_CHANNELS"];

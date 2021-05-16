import { RunFunction } from "../../interfaces/Command";
import GuildConfig from "../../models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  const locate_schema = await GuildConfig.findOne({
    guildID: message.guild.id,
  });
  if (!locate_schema)
    return client.utils.sendError(
      `An error occured whilst locating your guilds data!`,
      message.channel
    );
  if (!args[0])
    return client.utils.sendError(
      `You need to specify a channel.`,
      message.channel
    );
  const channel = client.utils.getChannels(args[0], message.guild);
  if (!channel)
    return client.utils.sendError(
      `Unable to locate that channel! Please try again.`,
      message.channel
    );

  switch (args[1]?.toLowerCase()) {
    case "commands": {
      if (
        locate_schema.ignoreChannels?.length &&
        locate_schema.ignoreChannels.includes(channel.id)
      ) {
        await locate_schema.updateOne({
          $pull: { ignoreChannels: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully re-enabled that channel for command usage!`,
          message.channel
        );
      } else {
        await locate_schema.updateOne({
          $push: { ignoreChannels: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully disabled that channel from command usage!`,
          message.channel
        );
      }
    }

    case "antiad": {
      if (
        locate_schema.ignoreAntiad?.length &&
        locate_schema.ignoreAntiad.includes(channel.id)
      ) {
        await locate_schema.updateOne({
          $pull: { ignoreAntiad: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully re-enabled that channel for anti advertisements!!`,
          message.channel
        );
      } else {
        await locate_schema.updateOne({
          $push: { ignoreAntiad: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully disabled that channel from triggering the anti advertisement!`,
          message.channel
        );
      }
    }

    case "automod": {
      if (
        locate_schema.ignoreAutomod?.length &&
        locate_schema.ignoreAutomod.includes(channel.id)
      ) {
        await locate_schema.updateOne({
          $pull: { ignoreAutomod: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully re-enabled that channel for auto moderation!!`,
          message.channel
        );
      } else {
        await locate_schema.updateOne({
          $push: { ignoreAutomod: channel.id },
        });

        return client.utils.succEmbed(
          `Successfully disabled that channel from triggering the auto moderation!`,
          message.channel
        );
      }
    }

    default:
      return client.utils.sendError(
        `You need to specify either: 'commands', 'autoad' or 'automod'.`,
        message.channel
      );
  }
};

export const name: string = "ignore";
export const category: string = "Administrative";
export const description: string =
  "Have the Bot ignore the specified message types in a certain channel.";
export const userPerms: string[] = ["MANAGE_GUILD"];

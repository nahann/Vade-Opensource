import { RunFunction } from "../../interfaces/Command";
import createLogChannel from "../../../src/models/GuildConfig/Logging";

export const run: RunFunction = async (client, message, args) => {
  console.log(`running`);

  const validTypes = client.config.validTypes;
  const sendError = client.utils.sendError;

  let fetchList = await createLogChannel.find({
    guildID: message.guild.id,
  });
  const findChannel = message.guild.channels.cache;
  const channelList = await fetchList.map(
    (channel) =>
      `${findChannel.get(channel.channelID)} **--** \`${channel.type.join(
        "`, `"
      )}\``
  );

  const embed = new client.embed().setSuccessColor();

  if (!args.length) {
    embed
      .setTitle("📃 Logging Channels")
      .setDescription(
        `${
          channelList.length ? channelList.join("\n") : "**`None`**"
        }\n\nPlease mention a channel or what log you want this channel to keep.`
      )
      .setFooter(
        `Types available: ${validTypes.join(", ")}`,
        client.user.displayAvatarURL()
      )
      .setColor(channelList.length ? "GREEN" : "RED");
    return message.channel.send(embed);
  }

  if (!args[1]) {
    if (validTypes.indexOf(args[0]) < 0) {
      return sendError(
        `That is not a valid log type\nTypes available: \`${validTypes.join(
          ", "
        )}\``,
        message.channel
      );
    }
    return await client.utils.createLogCh(message, message.channel.id, args[0]);
  }

  let channelid = args[0].slice(2, args[0].length - 1);
  if (
    findChannel.get(channelid) &&
    findChannel.get(channelid).type === "text"
  ) {
    if (validTypes.indexOf(args[1]) < 0) {
      return sendError(
        `That is not a valid log type\nTypes available: \`${validTypes.join(
          ", "
        )}\``,
        message.channel
      );
    }
    return await client.utils.createLogCh(message, channelid, args[1]);
  } else {
    return sendError("Please mention a valid text channel!", message.channel);
  }
};
export const name: string = "modlog";
export const category: string = "Administrative";
export const description: string =
  "Set the Guilds moderation log for the specified type.";
export const aliases: string[] = ["logging", "logchannel"];

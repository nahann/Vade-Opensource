import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  if (message.channel.type !== "text") return;

  let embed = new client.embed().setMainColor();

  const player = client.manager.players.get(message.guild.id);
  if (!player)
    return client.utils.sendError("There is nothing playing", message.channel);
  const { channel } = message.member.voice;
  if (!channel)
    return client.utils.sendError(
      "You need to join a voice channel first",
      message.channel
    );
  if (channel.id !== player.voiceChannel)
    return client.utils.sendError(
      "You're not in the same voice channel as me",
      message.channel
    );
  if (player.paused)
    return client.utils.sendError(
      "The music is already paused",
      message.channel
    );

  player.pause(true);
  embed.setDescription(`${message.author} ⏸ paused the music!`);
  return message.channel.send(embed);
};
export const name: string = "pause";
export const category: string = "Music";
export const description: string = "Pause the current song.";

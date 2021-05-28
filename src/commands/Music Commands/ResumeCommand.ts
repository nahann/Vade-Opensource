import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, _args) => {
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
  if (!player.paused)
    return client.utils.sendError(
      "The music is already playing",
      message.channel
    );

  player.pause(false);
  embed.setDescription(`${message.author} ▶ resumed the music!`);
  return message.channel.send(embed).catch(console.error);
};
export const name: string = "resume";
export const category: string = "Music";
export const description: string =
  "Resume te player and continue the current song.";
export const aliases: string[] = ["continue"];

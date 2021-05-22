import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setMainColor();

    const player = client.manager.players.get(message.guild.id);
    if (!player)
      return client.utils.sendError(
        "There is nothing playing",
        message.channel
      );
    if (!player.queue.previous)
      return client.utils.sendError(
        "There is no previous song",
        message.channel
      );
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

    try {
      player.queue.unshift(player.queue.previous);
      await player.stop();
      embed.setDescription(`${message.author} ⏮️ playing the previous song`);
      message.channel.send(embed).catch(console.error);
    } catch (e) {
      return client.utils.sendError(
        `An error occured: ${e.message}`,
        message.channel
      );
    }


    }
export const name: string = 'previous';
export const category: string = 'Music';
export const description: string = 'Play the previous song.';
export const aliases: string[] = ['prior', 'previoussong'];

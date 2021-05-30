import type { RunFunction } from '../../interfaces/Command';;
import lyricsFinder from 'lyrics-finder';
import { TextChannel } from 'discord.js';

   export const run: RunFunction = async(client, message, _args) => {

    let embed = new client.embed().setClear()

    const player = client.manager.players.get(message.guild.id);
    if (!player)
      return client.utils.sendError(
        "There is nothing playing",
        message.channel
      );

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(player.queue.current.title, "");
      if (!lyrics)
        lyrics = `No lyrics found for \`${player.queue.current.title}\``;
    } catch (error) {
      lyrics = `No lyrics found for \`${player.queue.current.title}\``;
    }

    let lyricsEmbed = new client.embed()
      .setClear()
      .setTitle(`${player.queue.current.title} — Lyrics`)
      .setDescription(lyrics)
      .setTimestamp()
      .setIcon(message.guild)
      .setFooter(
        `Requested by ${message.author.username}`,
        message.author.displayAvatarURL()
      );

    if (message.channel.id !== player.options.textChannel) {
      embed.setDescription("Lyrics was sent to the queue channel");
      message.channel.send(embed);
    }

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return (await client.channels.fetch
      (player.options.textChannel) as TextChannel)
      ?.send(lyricsEmbed)
      .catch(console.error);


    }
export const name: string = 'lyrics';
export const category: string = 'Music';
export const description: string = 'Receive the lyrics for the currently playing song.';

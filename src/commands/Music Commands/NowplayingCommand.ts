import { RunFunction } from '../../interfaces/Command';
import createBar from 'string-progressbar';

   export const run: RunFunction = async(client, message, args) => {

    const player = client.manager.players.get(message.guild.id);
    if (!player)
      return client.utils.sendError(
        "There is nothing playing",
        message.channel
      );

    const { title, duration, identifier, uri } = player.queue.current;
    const seek = player.position;
    const left = duration - seek;

    let nowPlaying = new client.embed()
      .setMainColor()
      .setTitle("📻 Now playing:")
      .setDescription(`\`${title}\`\n${uri}`)
      .setThumbnail(`https://img.youtube.com/vi/${identifier}/mqdefault.jpg`);

    nowPlaying.addField(
      "\u200b",
      new Date(seek).toISOString().substr(11, 8) +
        "[" +
        createBar.filledBar(duration, seek, 15)[0] +
        "]" +
        new Date(duration - 1000).toISOString().substr(11, 8)
    ),
      false;

    nowPlaying.setFooter(
      "Time Remaining: " + new Date(left).toISOString().substr(11, 8)
    );

    return message.channel.send(nowPlaying);


    }
export const name: string = 'nowplaying';
export const category: string = 'Music';
export const description: string = 'View the currently playing song.';
export const aliases: string[] = ['np'];

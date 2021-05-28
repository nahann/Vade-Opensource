import { RunFunction } from '../../interfaces/Command';
import paginationEmbed from '../../Classes/Pagination';

   export const run: RunFunction = async(client, message, args) => {

    if(message.channel.type !== 'text') return;

    const permissions = message.channel.permissionsFor(client.user);
    if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
      return client.utils.sendError(
        "Missing permission to manage messages or add reactions",
        message.channel
      );

    const player = await client.manager.players.get(message.guild.id);
    if (!player)
      return client.utils.sendError(
        "There is nothing playing",
        message.channel
      );
    if (!player.queue.length)
      return client.utils.sendError(
        "There is nothing currently queued",
        message.channel
      );

    const embeds = await generateQueueEmbed(client, message, player.queue);
    let embed = new client.embed();

    if (message.channel.id !== player.options.textChannel) {
      embed.setDescription("Queue was sent to the queue channel");
      message.channel.send(embed);
    }

    if (!isNaN(parseInt(args[0]))) {
      if (parseInt(args[0]) > embeds.length)
        return client.utils.sendError(
          `The are only ${embeds.length} page(s) of queue!`,
          message.channel
        );
    }

    let emojiList = ["◀️", "▶️"];
    return await paginationEmbed(message, embeds, emojiList, 60 * 1000);

    }
export const name: string = 'queue';
export const category: string = 'Music';
export const description: string = 'View the servers current song queue.';
export const aliases: string[] = ['q'];

async function generateQueueEmbed(client, message, queue) {
    let embeds = [];
    let k = 10;
  
    for (let i = 0; i < queue.length; i += 10) {
      const current = queue.slice(i, k);
      let j = i;
      k += 10;
  
      const info = await current
        .map(
          (track) =>
            `**\`${++j}.\`**\`| [${client.utils.msConversion(track.duration)}]\` - [${
              track.title
            }](${track.uri})`
        )
        .join("\n");
      let totalDuration = 0;
     await queue.forEach((song) => {
        totalDuration = song.duration + totalDuration;
      });
      const embed = new client.embed()
        .setTitle("Song Queue\n")
        .setThumbnail(message.guild.iconURL())
        .setClear()
        .setDescription(
          `**Current Song - [${queue.current.title}](${queue.current.uri})**\n\n${info}`
        )
        .setFooter(
          `🎵 ${queue.length + 1}  •  🕒 ${client.utils.msConversion(totalDuration)}`
        );
      embeds.push(embed);
    }
    return embeds;
  }
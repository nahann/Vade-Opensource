import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setMainColor();

    const player = client.manager.players.get(message.guild.id);
    if (!player)
      return client.utils.sendError(
        "There is nothing playing",
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

    if (!args.length)
      return client.utils.sendError(
        `Usage: \`${client.prefix}remove <Queue Number>\`\nor \`${client.prefix}remove <#1>, <#2>, <#3>...\``,
        message.channel
      );

    if (parseInt(args[0]) > player.queue.length)
      return client.utils.sendError(
        `There are only **${player.queue.length}** songs in the queue!`,
        message.channel
      );

    const { title, uri } = player.queue[parseInt(args[0]) - 1];
    player.queue.splice(parseInt(args[0]) - 1, 1);
    embed.setDescription(
      `❌ ${message.author} removed [${title}](${uri}) from the queue`
    );
    return message.channel.send(embed);


    }
export const name: string = 'remove';
export const category: string = 'Music';
export const description: string = 'Remove a song from the Queue.';
export const aliases: string[] = ['r'];

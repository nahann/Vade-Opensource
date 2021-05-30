import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setClear()

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
        `Please enter a queue number!\nUsage: \`${client.prefix}move <Queue Number>\`\nor\`${client.prefix}move <From #> <To #>\``,
        message.channel
      );

    if (isNaN(parseInt(args[0])))
      return client.utils.sendError(
        `Please enter a vaild number!\nUsage: \`${client.prefix}move <Queue Number>\`\nor\`${client.prefix}move <From #> <To #>\``,
        message.channel
      );

    let song = player.queue[parseInt(args[0]) - 1];

    const arg = args.join(" ");
    const songNum = arg.split(" ").map((arg) => parseInt(arg));
    const maxNum = Math.max(...songNum);
    if (maxNum > player.queue.length)
      return client.utils.sendError(
        `There are only **${player.queue.length}** songs in the queue!`,
        message.channel
      );

    if (!args[1] && parseInt(args[0]) == 1)
      return client.utils.sendError(
        `\`${player.queue[0].title}\` is already queued to play next!`,
        message.channel
      );

    if (args[1] && !isNaN(parseInt(args[1]))) {
        // @ts-ignore
      player.queue = moveArrayElement(player.queue, parseInt(args[0]) - 1, parseInt(args[1]) - 1);
      embed.setDescription(
        `${message.author} 🚚 moved [${song.title}](${song.uri}) to **number ${args[1]}** in the queue.`
      );
      return message.channel.send(embed);
    } else {
        // @ts-ignore
      player.queue = moveArrayElement(player.queue, parseInt(args[0]) - 1, 0);
      embed.setDescription(
        `${message.author} 🚚 moved [${song.title}](${song.uri}) to **the next** in the queue.`
      );
      return message.channel.send(embed);
    }


    }
export const name: string = 'move';
export const category: string = 'Music'
export const description: string = 'Move a song to a chosen position in the Queue.';
export const aliases: string[] = ['shiftposition'];


function moveArrayElement(arr, fromIndex, toIndex) {
    arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
    return arr;
  }
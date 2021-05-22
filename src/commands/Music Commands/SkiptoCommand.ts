import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setMainColor();
    const prefix = await client.utils.resolvePrefix(message.guild.id);

    if (!args.length || isNaN(parseInt(args[0])))
      return client.utils.sendError(
        `Usage: \`${prefix}skip <Queue Number>\``,
        message.channel
      );

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

    if (!player.playing) player.playing = true;
    if (parseInt(args[0]) > player.queue.length)
      return client.utils.sendError(
        `The queue is only ${player.queue.length} songs long!`,
        message.channel
      );

      // @ts-ignore
    player.queue = player.queue.slice(parseInt(args[0]) - 1);

    player.stop();
    embed.setDescription(`${message.author} ⏭ skipped ${parseInt(args[0]) - 1} songs`);
    message.channel.send(embed).catch(console.error);


    }
export const name: string = 'skipto';
export const category: string = 'Music';
export const description: string = 'Skip to a certain track in the Queue.';

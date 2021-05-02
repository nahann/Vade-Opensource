import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    if(message.channel.type !== 'text') return;

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
    if (!player.playing) player.playing = true;

    if (player.queueRepeat || player.trackRepeat) {
      player.queue.push(player.queue.current);
    }

    embed.setDescription(
      `${message.author} ⏭ skipped [${player.queue.current.title}](${player.queue.current.uri})`
    );
    message.channel.send(embed).catch(console.error);

    await player.stop();



    }
export const name: string = 'skip';
export const category: string = 'Music'
export const description: string = 'Skip the current song.'
export const aliases: string[] = ['s']

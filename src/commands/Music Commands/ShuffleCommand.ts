import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setMainColor();

    const player = client.manager.players.get(message.guild.id);
    if (!player || !player.queue[0])
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

    player.queue.shuffle();
    embed.setDescription(`${message.author} 🔀 shuffled the queue`);
    message.channel.send(embed).catch(console.error);


    }
export const name: string = 'shuffle';
export const category: string = 'Music';
export const description: string = 'Shuffle the queue into a new order.';
export const premiumOnly: boolean = true;

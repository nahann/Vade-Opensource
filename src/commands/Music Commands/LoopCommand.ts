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

      if(player.queue.size >= 1) {
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "Enabled" : "Disabled";
        embed.setDescription(`🔁 **${trackRepeat}** track repeat.`);
        return message.channel.send(embed);
      }

    if (args.length && /track/i.test(args[0])) {
      player.setTrackRepeat(!player.trackRepeat);
      const trackRepeat = player.trackRepeat ? "Enabled" : "Disabled";
      embed.setDescription(`🔁 **${trackRepeat}** track repeat.`);
      return message.channel.send(embed);
    }

    player.setQueueRepeat(!player.queueRepeat);
    const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
    embed.setDescription(`🔁 **${queueRepeat}** queue repeat`);
    return message.channel.send(embed);


    }
export const name: string = 'loop';
export const category: string = 'Music';
export const description: string = 'Start a loop for the Queue.';

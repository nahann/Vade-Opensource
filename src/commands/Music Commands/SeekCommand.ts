import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

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

    let time = args[0];
    if (!time)
      return client.utils.sendError(
        "Please enter a time interval\n\n**i.e.** `1s`, `10m`, `3m3s`, `47s`",
        message.channel
      );

    let actualTime = 0;
    let magnitudes = time.split(/s|d|m|h/).filter((word) => word != "");
    let typesOfTime = time.split(/[0-9]+/).filter((word) => word != "");

    if (
      magnitudes.length == typesOfTime.length &&
      -1 == time.search(/a|b|c|e|f|g|i|j|k|l|n|o|p|q|r|t|u|v|w|x|y|z/)
    ) {
      for (let i = 0; i < magnitudes.length; i++) {
        switch (typesOfTime[i]) {
          case "s":
            actualTime += parseInt(magnitudes[i]) * 1000;
            break;
          case "m":
            actualTime += parseInt(magnitudes[i]) * 60000;
            break;
          case "h":
            actualTime += parseInt(magnitudes[i]) * 3600000;
            break;
          case "d":
            actualTime += parseInt(magnitudes[i]) * 86400000;
            break;
          default:
          // nothing
        }
      }
      if (actualTime >= player.queue.current.duration)
        return client.utils.sendError(
          "Cannot seek beyond length of song.",
          message.channel
        );

      player.seek(actualTime);

      let embed = new client.embed()
        .setClear()
        .setDescription(`⏩ Seeked to ${args[0]}`)
        .setIcon(message.guild);
      return message.channel.send(embed);
    } else {
      return client.utils.sendError(
        "Please enter time interval in the correct format\n\n**i.e.** `1s`, `10m`, `3m3s`, `47s`",
        message.channel
      );
    }

    }
export const name: string = 'seek';
export const category: string = 'Music';
export const description: string = 'Skip to a certain point in the current song.';
export const aliases: string[] = ['goto'];

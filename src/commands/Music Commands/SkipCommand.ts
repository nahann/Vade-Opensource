import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

  
    if(message.channel.type !== 'text') return;


    let embed = new client.embed().setMainColor().setFooter(`Vade Music`, client.user.displayAvatarURL());


    const player = client.manager.players.get(message.guild.id);
    if(!player) return client.utils.sendError(`There is nothing playing!`, message.channel);

    const { channel } = message.member.voice;
    if(!channel) return client.utils.sendError(`You must be connected to a Voice Channel to use this Command.`, message.channel);
    if(channel.id !== player.voiceChannel) return client.utils.sendError(`You are not in the same Voice Channel as me.`, message.channel);
    if(!player.playing) return client.utils.sendError(`There is nothing playing.`, message.channel);
    if(player.queueRepeat || player.trackRepeat) {
      player.queue.push(player.queue.current);
    }


    embed.setDescription(`${message.author} ⏭ skipped [${player.queue.current.title}](${player.queue.current.uri})`);

    message.channel.send(embed);

    player.stop();


    }
export const name: string = 'skip';
export const category: string = 'Music'
export const description: string = 'Skip the current song.'
export const aliases: string[] = ['s']

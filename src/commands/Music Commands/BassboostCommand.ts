

import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    if(message.channel.type !== 'text') return;

    
   
    const levels = {
        none: 0.0,
        low: 0.2,
        medium: 0.3,
        high: 0.35,
        veryhigh: 0.4,
        purebass: 0.6,
    };
    
    let embed = new client.embed().setMainColor();
    
    const player = client.manager.players.get(message.guild.id);
    const bassboost = new Array(player.bands.slice(1))
    console.log(bassboost)
    if (!player) return client.utils.sendError('There is nothing playing', message.channel);
    const { channel } = message.member.voice;
    if (!channel) return client.utils.sendError('You need to join a voice channel first', message.channel);
    if (channel.id !== player.voiceChannel)
        return client.utils.sendError("You're not in the same voice channel as me", message.channel);
    
    if (!args.length) {
        embed.setDescription(
            `The current bassboost level is: **${
                bassboost ?? 'none'
            }**\n\nAvailable levels are; \`none\`, \`low\`, \`medium\`, \`high\`, \`veryhigh\`, and \`purebass\``
        );
        return message.channel.send(embed);
    }
    
    let level = 'none';
    if (args[0].toLowerCase() in levels) {
        level = args[0].toLowerCase();
    
        player.setEQ(
            ...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] }))
        );
        embed.setDescription(`Successfully set the bassboost level to **${args[0]}**`);
        return message.channel.send(embed);
    } else {
        return client.utils.sendError(
            'Please enter a valid bassboost level\n\nAvailable levels are; `none`, `low`, `medium`, `high`, `veryhigh`, and `purebass`',
            message.channel
        );
    }
    }
export const name: string = 'bassboost';
export const category: string = 'Music';
export const description: string = 'Apply a bassboost effect to the Music.';
export const aliases: string[] = ['bb'];

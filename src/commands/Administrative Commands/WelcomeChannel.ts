import { RunFunction } from '../../interfaces/Command';
import guild_data from '../../../models/guild';

   export const run: RunFunction = async(client, message, args) => {


    const channel = client.utils.getChannels(args[0], message.guild);
    if(!channel && args[0].toLowerCase() !== 'remove') return message.channel.send(`Please state a channel name, ID or mention within this server. Or state "remove".`);
    const check_data = await guild_data.findOne({ guildID: message.guild.id });
    if(channel && args[0].toLowerCase() !== 'remove') {
        
        if(check_data) {
            await check_data.update({
                welcomeChannel: channel.id,
                welcomeType: 'message',
            });
    
            return message.channel.send(`Successfully updated your configured welcome channel.`);
        }
    } else if(check_data && args[0].toLowerCase() === 'remove') {
        await check_data.updateOne({
            welcomeChannel: null,
            welcomeType: null,
        });

        return message.channel.send(`Successfully removed your welcome channel.`);
    } else if(!check_data) {
        const newData = new guild_data({
            guildName: message.guild.name,
            guildID: message.guild.id,
            prefix: "!",
            welcomeChannel: channel.id,
            welcomeType: 'message',
        });
        await newData.save()
        return message.channel.send(`Successfully set your configured welcome channel.`);
    }

    }
export const name: string = 'welcomechannel';
export const category: string = 'Administrative';
export const description: string = 'Configure the guilds welcome channel.';
export const aliases: string[] = ['welcomec'];

import { RunFunction } from '../../interfaces/Command';
import StarboardSchema from '../../models/GuildConfig/guild';

   export const run: RunFunction = async(client, message, args) => {


    const data = await StarboardSchema.findOne({ Guild: message.guild.id });
    const premiumCheck = await client.utils.checkPremium(message.guild.ownerID);
    if(!data) return client.utils.sendError(`Looks like there was an error fetching your guilds data. Please try again.`, message.channel);
    if(!args[0]) return client.utils.sendError(`Please specify a channel.`, message.channel);
    const channel = client.utils.getChannels(args[0], message.guild);
    if(!channel && args[0]?.toLowerCase() !== 'remove') return client.utils.sendError(`Please specify a valid channel.`, message.channel);
    if(args[0]?.toLowerCase() === 'remove') {
       if(!data?.Starboard) return client.utils.sendError(`You do not currently have a starboard configured for this guild.`, message.channel);
       await data.updateOne({
           Starboard: null
       });
       return client.utils.succEmbed(`Successfully removed your current starboard channel!`, message.channel);
    }
    const amount = parseInt(args[1]);
    if(!amount || isNaN(amount)) return client.utils.sendError(`You need to specify the minimum amount of reactions for a message to be sent to the starboard channel.`, message.channel);

    await data.updateOne({
        Starboard: channel.id,
        StarAmount: amount,
    });
    return client.utils.succEmbed(`Successfully set your starboard channel to ${channel} with the minimum reactions required as ${amount}!`, message.channel);
    }
export const name: string = 'starboard';
export const category: string = 'Administrative';
export const description: string = 'Configure the guilds starboard settings.';
export const aliases: string[] = ['star'];

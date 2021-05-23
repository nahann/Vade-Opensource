import { RunFunction } from '../../interfaces/Command';
import StarboardSchema from '../../models/GuildConfig/guild';

   export const run: RunFunction = async(client, message, args) => {


    const data = await StarboardSchema.findOne({ Guild: message.guild.id });
    const premiumCheck = await client.utils.checkPremium(message.guild.ownerID);
    if(!data) {


        if(!args.length) return client.utils.sendError(`You need to specify a channel!`, message.channel);
        const channel = client.utils.getChannels(args[0], message.guild);
        if(!channel) return client.utils.sendError(`You need to specify a valid channel!`, message.channel);
        



    }



    if(!args.length) {



    }


    }
export const name: string = 'starboard';
export const category: string = 'Administrative';
export const description: string = 'Configure the guilds starboard settings.';
export const aliases: string[] = ['star'];

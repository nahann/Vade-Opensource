import { RunFunction } from '../../interfaces/Command';
import ReactionRole from '../../../models/GuildConfig/ReactionRoles';

   export const run: RunFunction = async(client, message, args) => {

    if(message.channel.type !== 'text') return;

    const results = await ReactionRole.find({ guildID: message.guild.id });

    if(results && results.length) {
        for(const result of results) {
            await result.delete();            
        }
        return client.utils.succEmbed(`Successfully cleared this guilds reaction roles!`, message.channel);
    } else {
        return client.utils.sendError(`Couldn't locate any reaction roles configured for this Server!`, message.channel);
    }



    }
export const name: string = 'rrwipe';
export const category: string = 'Reaction Roles'
export const description: string = 'Clear all Reaction Roles from the current server.';
export const aliases: string[] = ['reactionwipe'];
export const userPerms: string[] = ['MANAGE_ROLES'];
export const botPerms: string[] = ['MANAGE_ROLES'];
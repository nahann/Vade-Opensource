import type { RunFunction } from '../../interfaces/Command';;
import guild_schema from '../../models/GuildConfig/guild';

   export const run: RunFunction = async(client, message, args) => {

    const locate_schema = await guild_schema.findOne({ guildID: message.guild.id });
    if(!locate_schema) return client.utils.sendError(`Unable to locate your Guilds data.`, message.channel);

    if(locate_schema.Automod) {
        await locate_schema.updateOne({
            Automod: false
        });

        return client.utils.succEmbed(`Successfully disabled the automod toggle for this server.`, message.channel)
    } else {
        await locate_schema.updateOne({
            Automod: true
        });

        return client.utils.succEmbed(`Successfully enabled the automod toggle for this server.`, message.channel)

        
    }

    }
export const name: string = 'automoderation';
export const category: string = 'Administrative';
export const description: string = 'Toggle the auto moderation module for the current server.';
export const aliases: string[] = ['automod'];
export const userPerms: string[] = ['MANAGE_GUILD'];
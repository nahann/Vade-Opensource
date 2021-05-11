import { RunFunction } from '../../interfaces/Command';
import MainGuild from '../../../models/GuildConfig/guild';

   export const run: RunFunction = async(client, message, args) => {


    const document = await MainGuild.findOne({ guildID: message.guild.id });
    if(!document) {
        return client.utils.sendError(`Looks like there was an error finding your Guilds data. Please try again later.`, message.channel);
    }

    let title = message.guild.name;
    let description = document.description ?? 'No description set.';

    let desc = args.join(" ");
    if (!desc) {
        return client.utils.sendError("You must specify some content for the server description, or supply 'remove'.", message.channel);
    }

   
    if (desc.toLowerCase() === "remove") {
        if (!document.description) {
            return client.utils.sendError("There is no configured description for this server, you must set one before removing it.", message.channel);
        }

        await document.updateOne({
            description: 'No description set.'
        });

        return client.utils.succEmbed(`Successfully removed your servers description!`, message.channel);
    }



    }
export const name: string = 'setdescription';
export const category: string = 'Advertising';
export const description: string = 'Set your servers description.';
export const aliases: string[] = ['sdesc', 'description'];

import type { RunFunction } from '../../interfaces/Command';
import main_schema from '../../models/GuildConfig/guild';

export const run: RunFunction = async(client, message, args) => {
    if(!args.length) return client.utils.sendError(`You need to specify either  "remove" or a channel name, ID or mention.`, message.channel);
    const locate_schema = await main_schema.findOne({ guildID: message.guild.id });
    if(!locate_schema) return client.utils.sendError(`There was an error locating your Guilds data. Please try again later.`, message.channel);
   if(args[0]?.toLowerCase() === "remove")  {
       if(!locate_schema?.bumpChannel) return client.utils.sendError(`You don't currently have a bump channel configured for this server.`, message.channel);
       await locate_schema.updateOne({
           bumpChannel: null,
       });

       return client.utils.succEmbed(`Successfully removed your current bump channel.`, message.channel);
   } else {
       const channel = client.utils.getChannels(args.join(" "), message.guild);
       if(!channel) return client.utils.sendError(`Unable to locate that channel, please try again.`, message.channel);
       await locate_schema.updateOne({
           bumpChannel: channel.id,
       });

       return client.utils.succEmbed(`Successfully set your bump channel to ${channel}!`, message.channel);
   }

}

export const name: string = 'setchannel';
export const category: string = 'Advertising';
export const description: string = 'Set the channel to receive the "bumps".';
export const aliases: string[] = ['channel', 'bumpchannel'];
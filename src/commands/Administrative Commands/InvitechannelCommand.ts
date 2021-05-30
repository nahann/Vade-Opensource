import type { RunFunction } from '../../interfaces/Command';;
import main_schema from '../../models/GuildConfig/guild';

   export const run: RunFunction = async(client, message, args) => {

    if(!args.length) return client.utils.sendError(`You need to specify either "remove" or a channel name, ID or mention.`, message.channel);
    const guild_data = await main_schema.findOne({ guildID: message.guild.id });
    if(args[0]?.toLowerCase() === "remove") {
        if(!guild_data || !guild_data.inviteChannel) return client.utils.sendError(`This Guild doesn't currently have an Invite Logging Channel configured.`, message.channel);
        await guild_data.updateOne({
            inviteChannel: null,
        });
        return client.utils.succEmbed(`Successfully removed your Invite Logging Channel.`, message.channel);
    } else {
        const channel = client.utils.getChannels(args[0], message.guild);
        if(!channel) return client.utils.sendError(`Unable to locate that channel. Please try again.`, message.channel);
        if(!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return client.utils.sendError(`I cannot send messages in that channel. Please fix that before setting a channel.`, message.channel);
        await guild_data.updateOne({
            inviteChannel: channel.id,
        });

        return client.utils.succEmbed(`Successfully set ${channel} as your Invite Logging channel.`, message.channel);
    }

    }
export const name: string = 'invitechannel';
export const category: string = 'Administrative';
export const description: string = 'Set a channel to the invite logging channel for the current server.';
export const aliases: string[] = ['invchannel'];
export const userPerms: string[] = ['MANAGE_CHANNELS'];
export const botPerms: string[] = ['MANAGE_CHANNELS'];

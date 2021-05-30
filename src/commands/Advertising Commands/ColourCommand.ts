import type { RunFunction } from '../../interfaces/Command';
import main_schema from '../../models/GuildConfig/guild';

export const run: RunFunction = async(client, message, args) => {

    const locate_schema = await main_schema.findOne({ guildID: message.guild.id });
    if(!locate_schema) return client.utils.sendError(`Unable to locate your guilds data. Please try again later.`, message.channel);
    if(!args[0] || !client.utils.validateHex(args[0])) return client.utils.sendError(`Invalid hex provided. Please try again.`, message.channel);
    await locate_schema.updateOne({
        bumpColour: args[0]
    });

    return client.utils.succEmbed(`Successfully set your hex colour to \`   ${args[0]}\``, message.channel);

}

export const name: string = 'colour';
export const category: string = 'Advertising';
export const description: string = 'Set your bump embeds colur!';
export const aliases: string[] = ['bumpcolour', 'bumpcolor'];
export const premiumOnly: boolean = true;
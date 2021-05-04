import { RunFunction } from '../../interfaces/Command';
import ms from 'ms';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed()
    .setTitle(`Uptime`)
    .setDescription(`My current uptime is: \n\n\`${ms(client.uptime, { long: true })}\``)
    .setClear()
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL());


    return message.channel.send(embed);

    }
export const name: string = 'uptime';
export const category: string = 'Utility';
export const description: string = 'Check the Bots current uptime!';

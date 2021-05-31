import type { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    try {
        const data = await fetch("https://nekos.life/api/v2/img/slap").then((res) => res.json());
        const member = await client.utils.getMember(message, args[0], true);
        if(!member) return;
        const user = member?.user;
        const slapped = message.author.id === user.id ? "themselves" : user.username;

        const embed = new client.embed()
            .setTitle(`${message.author.username} slapped ${slapped}`)
            .setDescription(`[Click to view](${data.url})`)
            .setImage(`${data.url}`);

        return message.channel.send(embed);
    } catch (err) {
        return client.utils.sendError(`An error has occured: ${err}`, message.channel);
    }


}

export const name: string = 'slap';
export const category: string = 'Fun';
export const description: string = 'Slap someone!';
export const aliases: string[] = ['hit'];
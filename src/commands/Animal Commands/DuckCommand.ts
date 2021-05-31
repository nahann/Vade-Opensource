import type { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    try {
        const data = await fetch("https://random-d.uk/api/v1/random?type=gif,png").then((res) =>
            res.json(),
        );

        const embed = new client.embed()
            .setDescription(`[Click to view](${data.url})`)
            .setImage(data.url);

        message.channel.send(embed);
    } catch (err) {
        return client.utils.sendError(`An error has occured: ${err}`, message.channel);
    }

}

export const name: string = 'duck';
export const category: string = 'Animals';
export const description: string = 'Receive an image of a Duck!';
export const aliases: string[] = ['duckey'];
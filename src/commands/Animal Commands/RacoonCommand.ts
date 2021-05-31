import type { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    try {
        const data = await fetch("https://some-random-api.ml/img/racoon").then((res) => res.json());

        const embed = new client.embed()
            .setDescription(`[Click to view](${data.link})`)
            .setImage(data.link);

        message.channel.send(embed);
    } catch (err) {
        return client.utils.sendError(`An error has occured: ${err}`, message.channel);
    }

}

export const name: string = 'racoon';
export const category: string = 'Animals';
export const description: string = 'Receive an image of a Racoon!';
import phin from 'phin';
import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, _args) => {
    let { body } = await phin<{ url: string }>({
        url: "https://random.dog/woof.json",
        parse: "json"
    });

    let dogembed = new client.embed()
        .setTitle("Doggo")
        .setImage(body.url);

    message.channel.send(dogembed);
}

export const name: string = 'dog';
export const category: string = 'Fun'
export const description: string = 'Receive an image of a Dog!'
export const aliases: string[] = ['doggo']

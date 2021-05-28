import { RunFunction } from '../../interfaces/Command';
import superagent from 'superagent';

   export const run: RunFunction = async(client, message, _args) => {

    let { body } = await superagent.get(`https://random.dog/woof.json`);

    let dogembed = new client.embed().setTitle("Doggo").setImage(body.url);

    message.channel.send(dogembed);

    }
export const name: string = 'dog';
export const category: string = 'Fun'
export const description: string = 'Receive an image of a Dog!'
export const aliases: string[] = ['doggo']

import { RunFunction } from '../../interfaces/Command';


export const run: RunFunction = async(client, message, args) => {

    const query = args[0];
    if(!query) return client.utils.sendError(`You need to include the discriminator that you want to search for!`, message.channel);
    const users = (await client.users.fetch())
}

export const name: string = 'discriminator';
export const category: string = 'Information'
export const description: string = 'Find out who has the same discriminator as you!';
export const aliases: string[] = ['discrim'];
import type { RunFunction } from '../../interfaces/Command';
import hastebin from "hastebin-gen"


export const run: RunFunction = async(client, message, args) => {

    const query = args[0];
    if(!query) return client.utils.sendError(`You need to include the discriminator that you want to search for!`, message.channel);

    const users = client.users.cache
        .filter((user) => user.discriminator === query)
        .map((m) => m.tag);
    if (!users.length)
        return message.channel.send(
            `No users were found with the discrimnator: **${query}**!`
        );

    hastebin(users.join("\n"))
        .then((haste) => {
            message.channel.send(
                `${users.length} Users found with the Discriminator: **#${query}**! \n${haste}`
            );
        })
        .catch((_e) => {
            message.channel.send("Something went wrong, please try again later!");
        });
}

export const name: string = 'discriminator';
export const category: string = 'Information'
export const description: string = 'Find out who has the same discriminator as you!';
export const aliases: string[] = ['discrim'];
import type { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    const pokemon = args.join(" ");
    if (!pokemon) {
        return client.utils.sendError(`Incorrect format.`, message.channel);
    }

    const res = await fetch(
        `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/pokedex.php?pokemon=${args.join(
            " "
        )}`
    )
        .then((info) => info.json())
        .catch((_err) => {
            return client.utils.sendError(`An unknown error has occured.`, message.channel);
        });

    const embed = new client.embed()
        .setAuthor(
            res.name,
            `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${res.images.typeIcon}`
        )
        .setDescription(
            `Type of this pokemon is **${res.info.type}**. ${res.info.description}`
        )
        .setThumbnail(
            `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${res.images.photo}`
        )
        .setFooter(
            `Weakness of pokemon - ${res.info.weakness}`,
            `https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/${res.images.weaknessIcon}`
        )
        .setMainColor();
    message.channel.send(embed);
    
}

export const name: string = 'pokemon';
export const category: string = 'Utility';
export const description: string = 'Search for a pokemon!';
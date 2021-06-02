import type { RunFunction } from '../../interfaces/Command';;
import paginationEmbed from '../../Classes/Pagination';

   export const run: RunFunction = async(client, message, _args) => {

    const guilds = client.guilds.cache;
    let embed = new client.embed()
    .setDescription(guilds.map((a) => `${a.name}: ${a.id}`))

    let embeds = []
    embeds.push(embed)

    let emojiList = ["◀️", "▶️"];
    return paginationEmbed(message, embeds, emojiList, 60000)

    }
export const name: string = 'serverlist';
export const category: string = 'Development';
export const description: string = 'List the Bots servers.';
export const aliases: string[] = ['slist'];
export const devOnly: boolean = true;

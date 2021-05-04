import { RunFunction } from '../../interfaces/Command';
import { Paginate } from "@the-nerd-cave/paginate";
import paginationEmbed from "../../Classes/Pagination";

   export const run: RunFunction = async(client, message, args) => {


    const role = args.join(" ");
    if(!role) return message.channel.send(`Please specify a role!`);

    const locate_role = client.utils.getRoles(role, message.guild);
    if(!locate_role) return  message.channel.send(`Unable to locate that role!`);

    let members = locate_role.members.map((i) => i.user.tag);

    const pages = new Paginate(members, 8).getPaginatedArray();

    const embeds = pages.map((page, index) => {
        return new client.embed()
        .setTitle(`${client.utils.capitalise(locate_role.name)}'s Members`)
        .setDescription(page || `No more Members to be listed on page ${index + 1}`)
        .setClear()
        .setTimestamp();
    });

    let emojiList = ["◀️", "▶️"];
     return paginationEmbed(message, embeds, emojiList, 60 * 1000).catch((err) => {
         console.log(err);
         return message.channel.send(`An unknown error has occured.`);
     });
   

    }
export const name: string = 'inrole';
export const category: string = 'Utility'
export const description: string = 'View the members that are in a certain role.'
export const aliases: string[] = ['rolemembers']

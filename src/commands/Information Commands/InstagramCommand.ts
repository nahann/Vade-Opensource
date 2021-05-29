import { RunFunction } from '../../interfaces/Command';
import axios from 'axios'

   export const run: RunFunction = async(client, message, args) => {

    if (!args[0]) {
        return client.utils.sendError(`Please provide an Instagram username to search for.`, message.channel)
    }
    let url, response, account, details;
    try {
        url = `https://instagram.com/${args[0]}/?__a=1`;
        response = await axios.get(url)
        account = response.data
        details = account.graphql.user
    } catch (error) {
        return client.utils.sendError(`Could not locate that user! This is usually due to their account being set to private.`, message.channel)
    }

    const embed = new client.embed()
        .setTitle(`${details.is_verified ? `${details.username} <:Verified:847783264206323732>` : ` ${details.username}`} ${details.is_private ? '🔒' : ''} `)
        .setDescription(details.biography)
        .setThumbnail(details.profile_pic_url)
        .addFields(
            {
                name: "Total Posts:",
                value: details.edge_owner_to_timeline_media.count.toLocaleString(),
                inline: true
            },
            {
                name: "Followers:",
                value: details.edge_followed_by.count.toLocaleString(),
                inline: true
            },
            {
                name: "Following:",
                value: details.edge_follow.count.toLocaleString(),
                inline: true
            }
        )

    message.channel.send(embed)
}


export const name: string = 'instagram';
export const category: string = 'Information';
export const description: string = 'Search up a users Instagram account and view the results!';
export const aliases: string[] = ['insta'];

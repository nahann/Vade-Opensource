import type { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    try {
        const data = await fetch("https://www.reddit.com/r/food/random/.json").then((res) =>
            res.json(),
        );

        const [children] = data[0].data.children;
        const permaLink = children.data.permalink;
        const url = `https://reddit.com${permaLink}`;
        const image = children.data.url;
        const title = children.data.title;
        const upvotes = children.data.ups;
        const comments = children.data.num_comments;

        const embed = new client.embed()
            .setTitle(title)
            .setURL(url)
            .setImage(image)
            .setFooter(`👍: ${upvotes} -  💬: ${comments}`);

        return message.channel.send(embed);
    } catch (err) {
        return client.utils.sendError(`An error has occured: ${err}`, message.channel);
    }

}

export const name: string = 'food';
export const category: string = 'Fun';
export const description: string = 'Get a random image of some food!';
export const aliases: string[] = ['foodporn'];
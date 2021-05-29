import type { RunFunction } from '../../interfaces/Command';
import loadPlaylist from '../../models/Users/playlist';
import paginationEmbed from "../../Classes/Pagination";

export const run: RunFunction = async(client, message, args) => {

    let member = message.author;
    let mention = message.mentions.users.first();
    if (mention) {
        args.shift();
        member = mention;
    }

    let fetchList;

    try {
        fetchList = await loadPlaylist.find({
            userID: member.id,
        });
    } catch (err) {
        return console.log(err);
    }

    if (!fetchList.length)
        return client.utils.sendError(
            `Can not find any playlist that was saved by ${member}!`,
            message.channel
        );

    if (!args[0]) {
        const embeds2 = generateListEmbed(client, message, fetchList);
        return await message.channel.send(embeds2);
    }

    const pName = args.join(" ");
    try {
        fetchList = await loadPlaylist.findOne({
            userID: member.id,
            playlistName: pName,
        });
    } catch (err) {
        return console.log(err);
    }

    if (!fetchList)
        return client.utils.sendError(
            `Can't find playlist \`${pName}\` that was saved by ${member}!`,
            message.channel
        );

    const embeds = generateQueueEmbed(message, fetchList);

    let emojiList = ["◀️", "▶️"];
    return await paginationEmbed(message, embeds, emojiList, 60 * 1000);

}

export const name: string = 'listplaylist';
export const category: string = 'Music';
export const description: string = 'List all of the playlists that a user has saved.';
export const aliases: string[] = ['listp'];

function generateQueueEmbed(message, list) {
    let queue = list.playlistArray;

    let embeds = [];
    let k = 10;

    for (let i = 0; i < queue.length; i += 10) {
        const current = queue.slice(i, k);
        let j = i;
        k += 10;

        const info = current
            .map(
                (track) =>
                    `**\`${++j}.\`**\`| [${msConversion(track.duration)}]\` - [${
                        track.title
                    }](${track.uri})`
            )
            .join("\n");

        let totalDuration = 0;
        queue.forEach((track) => {
            totalDuration = track.duration + totalDuration;
        });

        const embed = new this.client.embed()
            .setTitle(`Playlist: \n`)
            .setThumbnail(message.author.displayAvatarURL())
            .setClear()
            .setDescription(`**\`${list.playlistName}\`**\n\n${info}`)
            .setFooter(`🎵 ${queue.length}  •  🕒 ${msConversion(totalDuration)}`);
        embeds.push(embed);
    }
    return embeds;
}

function generateListEmbed(client, message, list) {
    let embeds = [];
    let k = 10;
    for (let i = 0; i <= 10; i++) {
        const current = list.slice(i, k);

        let j = i;
        const info = current
            .map((pl) => `**${++j}** - \`${pl.playlistName}\``)
            .join("\n");

        const embed = new client.embed()
            .setAuthor(
                `${message.author.username}'s Playlists\n`,
                message.author.displayAvatarURL()
            )
            .setClear()
            .setDescription(info)
            .setFooter(`Playlist (${list.length} / 5)`);
        embeds.push(embed);
    }
    return embeds;
}

function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;

    // @ts-ignore
    sec = "" + sec;
    // @ts-ignore
    sec = ("00" + sec).substring(sec.length);

    if (hrs > 0) {
        // @ts-ignore
        min = "" + min;
        // @ts-ignore
        min = ("00" + min).substring(min.length);
        return hrs + ":" + min + ":" + sec;
    } else {
        return min + ":" + sec;
    }
}
import type { RunFunction } from '../../interfaces/Command';
import savePlaylist from '../../models/Users/playlist';
import { Types } from 'mongoose';

export const run: RunFunction = async(client, message, args) => {

    const player = await client.manager.players.get(message.guild.id);
    const serverQueue = player ? player.queue : null;
    if (!serverQueue)
        return client.utils.sendError(
            `Nothing playing in this Server`,
            message.channel
        );


    // @ts-ignore
    let queue = serverQueue.songs;
    const pName = args.join(" ");

    if (!args[0])
        return client.utils.sendError(
            `Please enter a playlist name!`,
            message.channel
        );

    let fetchList = await savePlaylist.find({
        userID: message.author.id,
    });

    if (fetchList.length >= 5)
        return client.utils.sendError(
            `You are only allowed to save up to **5** Playlists!`, message.channel
        );

    let pNameFinder = await savePlaylist.find({
        userID: message.author.id,
        playlistName: pName,
    });

    if (pNameFinder.length > 0)
        return client.utils.sendError(
            `You already have a playlist with that name!`,
            message.channel
        );

    if (pName.length > 32)
        return client.utils.sendError(
            `Playlist names could only be **32** characters or less!`,
            message.channel
        );

    const data = new savePlaylist({
        _id: Types.ObjectId(),
        username: message.author.tag,
        userID: message.author.id,
        playlistName: pName,
        playlistArray: queue,
    });
    await data.save((err) => {
        if (err) console.error(err);
    });

    return client.utils.succEmbed(`✅ ${message.author} has successfully saved playlist \`${pName}\`!`, message.channel);
}

export const name: string = 'saveplaylist';
export const category: string = 'Music';
export const description: string = 'Save a playlist under your profile for future use.';
export const aliases: string[] = ['savep'];
import type { RunFunction } from '../../interfaces/Command';
import playPlaylist from '../../models/Users/playlist';
import { TrackUtils } from 'erela.js';


export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed().setClear()

    const { channel } = message.member.voice;
    const { DEFAULT_VOLUME } = client.config;
    if (!channel)
        return client.utils.sendError(
            "You need to join a voice channel first!",
            message.channel
        );

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
        return client.utils.sendError(
            "Cannot connect to voice channel, missing permissions",
            message.channel
        );
    if (!permissions.has("SPEAK"))
        return client.utils.sendError(
            "I cannot speak in this voice channel, make sure I have the proper permissions!",
            message.channel
        );

    let player = client.manager.players.get(message.guild.id);

    if (!player) {
        player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            volume: DEFAULT_VOLUME,
            selfDeafen: true,
        });
    }

    if (player.playing && channel !== message.guild.me.voice.channel)
        return client.utils.sendError(
            `You must be in the same channel as ${message.client.user}`,
            message.channel
        );

    if (!args.length)
        return client.utils.sendError(
            `Usage: \`${client.prefix}${name} <playlist name>\``,
            message.channel
        );

    let member = message.author;
    const pName = args.join(" ");

    let fetchList;
    try {
        fetchList = await playPlaylist.findOne({
            userID: member.id,
            playlistName: pName,
        });
    } catch (err) {
        return console.log(err);
    }

    if (!fetchList)
        return client.utils.sendError(
            `Can not playlist named \`${pName}\` under the user ${member}!`,
            message.channel
        );

    let songs;
    songs = await Promise.all(
        fetchList.playlistArray.map(async (tracks) => {
            return await client.manager.decodeTrack(tracks.track);
        })
    );

    let tracks = [];
    songs.map((data) => {
        tracks.push(TrackUtils.build(data, message.author));
    });

    if (!player.playing) {
        player.connect();
    }

    try {
        if (!player.queue.current) {
            player.queue.current = tracks[0];
            tracks.slice(1).map((arr) => {
                player.queue.push(arr);
            });
        } else {
            tracks.map((arr) => {
                player.queue.push(arr);
            });
        }
        if (!player.playing && !player.paused) {
            player.play();
        }
    } catch (error) {
        console.error(error);
        return client.utils
            .sendError(error.message, message.channel)
            .catch(console.error);
    }

    embed.setDescription(
        `✅ The playlist \`${pName}\` has been added to the queue by ${message.author}`
    );
    return message.channel.send(embed);


}

export const name: string = 'loadplaylist';
export const category: string = 'Music';
export const description: string = 'Load a playlist from your saved playlists.';
export const aliases: string[] = ['loadp'];
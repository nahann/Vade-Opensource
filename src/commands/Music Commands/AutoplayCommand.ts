import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const sendError = client.utils.sendError;
    const succEmbed = client.utils.succEmbed;

    const player = client.manager.players.get(message.guild.id);
    if (!player) return sendError('There is nothing playing', message.channel);
    const { channel } = message.member.voice;
    if (!channel) return sendError('You need to join a voice channel first', message.channel);
    if (channel.id !== player.voiceChannel)
        return sendError("You're not in the same voice channel as me", message.channel);

    if (client.autoplay.indexOf(message.guild.id) < 0) {
        client.autoplay.push(message.guild.id);
        succEmbed(`Successfully **enabled** autoplay for music`, message.channel);
        if (!player.queue.length && !player.trackRepeat && !player.queueRepeat) {
            let res = await player.search(
                `https://www.youtube.com/watch?v=${player.queue.current.identifier}&list=RD${player.queue.current.identifier}`,
                player.queue.current.requester
            );
            await player.queue.add(
                res.tracks.filter((t) => t.identifier !== player.queue.current.identifier)
            );
        }
    } else {
        client.autoplay = client.autoplay.filter((g) => g !== message.guild.id);
        succEmbed(`Successfully **disabled** autoplay for music`, message.channel);
    }


}

export const name: string = 'autoplay';
export const category: string = 'Music'
export const description: string = 'Enable the autoplay feature! Auto queue songs related to the last song!';
export const aliases: string[] = ['ap'];
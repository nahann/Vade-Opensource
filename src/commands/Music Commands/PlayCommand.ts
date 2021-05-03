import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    if(message.channel.type !== 'text') return;
    const prefix = await client.utils.resolvePrefix(message.guild.id);

    let embed = new client.embed().setMainColor();

        const { channel } = message.member.voice;
        if (!channel) return client.utils.sendError('You need to join a voice channel first!', message.channel);

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: channel.id,
            textChannel: message.channel.id,
            volume: client.config.DEFAULT_VOLUME,
            selfDeafen: true,
        });

        if (!player.playing) {
            player.connect();
        }
        const search = args.join(' ');
        let res;

        if (player.playing && channel.id !== message.guild.me.voice.channel.id)
            return client.utils.sendError(
                `You must be in the same channel as ${message.client.user}`,
                message.channel
            );
        if (!args.length)
            return client.utils.sendError(
                `Usage: \`${prefix}play <YouTube URL | Video Name | Soundcloud URL>\``,
                message.channel
            );

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT'))
            return client.utils.sendError(
                'Cannot connect to voice channel, missing permissions',
                message.channel
            );

        if (!permissions.has('SPEAK'))
            return client.utils.sendError(
                'I cannot speak in this voice channel, make sure I have the proper permissions!',
                message.channel
            );

        try {
            res = await player.search(search, message.author);
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw new Error(res.exception.message);
            }
        } catch (err) {
            return client.utils.sendError(
                `There was an error while searching:\n\`${err.message}\``,
                message.channel
            );
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                return client.utils.sendError('No results were found', message.channel);

            case 'TRACK_LOADED':
                let enqueueTrack = res.tracks[0];
                if (!enqueueTrack.track) await enqueueTrack.resolve();
                await player.queue.add(enqueueTrack);

                if (!player.playing && !player.paused && !player.queue.length) player.play();

                embed
                    .setTitle('▶️ Enqueuing:')
                    .setColor('#00f2ff')
                    .setThumbnail(
                        `https://img.youtube.com/vi/${enqueueTrack.identifier}/mqdefault.jpg`
                    )
                    .setDescription(`\`${enqueueTrack.title}\`\n${enqueueTrack.uri}`)
                    .setFooter(
                        `🎤 ${enqueueTrack.author}  •  ${
                            enqueueTrack.isStream
                                ? `◉ LIVE`
                                : `🕒 ${client.utils.msConversion(enqueueTrack.duration)}`
                        }`
                    );

                return message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 10 * 1000 }));

            case 'PLAYLIST_LOADED':
                if (!res.tracks.length)
                    return client.utils.sendError("That playlist doesn't contain any songs!", message.channel);
                embed.setAuthor(
                    `${message.author.username} has ${
                        !player.queue.totalSize ? `started` : `added`
                    } a playlist`,
                    message.author.displayAvatarURL()
                );

                await player.queue.add(res.tracks);
                if (!player.playing && !player.paused) player.play();

                embed
                    .setTitle(res.playlist.name)
                    .setDescription(
                        res.tracks
                            .slice(0, 10)
                            .map(
                                (track, index) =>
                                    `**\`${++index}.\`**\`| [${client.utils.msConversion(
                                        track.duration
                                    )}]\` - [${track.title}](${track.uri})`
                            )
                    )
                    .setFooter(
                        `🎵 ${res.tracks.length}  •  🕒 ${client.utils.msConversion(res.playlist.duration)}`
                    );

                embed.description =
                    embed.description +
                    `\n\nCheck the entire playlist with \`${prefix}queue\` command`;

                return message.channel.send(embed);

            case 'SEARCH_RESULT':
                const arg = message.content.slice(prefix.length).trim().split(/ +/);
                const commandName = arg.shift().toLowerCase();

                let index = 0;
                let searchEmbed;

                if (commandName === 'search') {
                    let max = 10,
                        collected,
                        filter = (m) =>
                            m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
                    if (res.tracks.length < max) max = res.tracks.length;

                    const results = res.tracks
                        .slice(0, max)
                        .map(
                            (track, index) =>
                                `**\`${++index}.\`**\`| [${client.utils.msConversion(track.duration)}]\` - [${
                                    track.title
                                }](${track.uri})`
                        )
                        .join('\n');

                    embed
                        .setAuthor(
                            'Please choose a number from the list of songs below',
                            message.author.displayAvatarURL()
                        )
                        .setDescription(results)
                        .setMainColor()
                        .setFooter('You have 30 seconds to select, or type end to cancel');

                    searchEmbed = await message.channel.send(embed);

                    try {
                        collected = await message.channel.awaitMessages(filter, {
                            max: 1,
                            time: 30 * 1000,
                            errors: ['time'],
                        });
                    } catch (e) {
                        if (!player.queue.current) player.destroy();

                        embed
                            .setFooter('')
                            .setDescription("You didn't provide a selection")
                            .setAuthor('');
                        return searchEmbed.edit(embed);
                    }

                    const first = collected.first().content;
                    collected.first().delete();
                    if (first.toLowerCase() === 'end') {
                        if (!player.queue.current) player.destroy();
                        embed.setFooter('').setDescription('Cancelled selection').setAuthor('');

                        return searchEmbed.edit(embed);
                    }

                    index = Number(first) - 1;
                    if (index < 0 || index > max - 1)
                        return client.utils.sendError(
                            `The number you provided too small or too big (1-${max})`,
                            message.channel
                        );
                } else {
                    embed.setDescription('Loading track...');
                    searchEmbed = await message.channel.send(embed);
                }

                const track = res.tracks[index];
                await player.queue.add(track);

                if (!player.playing && !player.paused && !player.queue.length) player.play();
                embed
                    .setColor('#00f2ff')
                    .setAuthor('')
                    .setTitle('▶️ Enqueuing:')
                    .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
                    .setDescription(`\`${track.title}\`\n${track.uri}`)
                    .setFooter(track.isStream ? `◉ LIVE` : `🕒 ${client.utils.msConversion(track.duration)}`);

                return searchEmbed.edit(embed);
        }


    }
    
export const name: string = 'play';
export const category: string = 'Music';
export const description: string = 'Play a song or add a song to the queue by name or link.';
export const aliases: string[] = ['p'];

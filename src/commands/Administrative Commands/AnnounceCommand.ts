import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const channel = client.utils.getChannels(args[0], message.guild);
    if (!channel)
        return message.channel.send(
            "Please provide a channel ID, mention or name."
        );

    const Announcement = args.slice(1).join(" ");
    const AnnounceEmbed = new client.embed()
        .setTitle("Announcement")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
            `**This is an announcement from ${message.author.tag}** \n\n${Announcement}`
        )
        .setFooter(`${message.guild.name} Announcement`)
        .setTimestamp()
        .setColor("#10ff00");
    channel
        // @ts-ignore
        .send(AnnounceEmbed)
        .then(message.reply(`I have made that announcement in ${channel}!`))
        .catch((err) => {
            console.error(err);
            client.utils.sendError(
                "I do not have permission to speak in that channel.", message.channel
            );
        });
}

export const name: string = 'announce';
export const category: string = 'Administrative';
export const description: string = 'Announce a message to a channel.';
export const aliases: string[] = ['announcement'];
import type { RunFunction } from '../../interfaces/Command';
import canvacord from 'canvacord';
import { MessageAttachment } from "discord.js";

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0]);

    if (!target) return;

    const user = await client.utils.fetch(target.id, message.guild.id);

    const neededXp = await client.utils.xpFor(user.level + 1)

    const rank = new canvacord.Rank()
        .setAvatar(
            target.user.displayAvatarURL({ dynamic: false, format: "png" })
        )
        .setCurrentXP(user.xp)
        .setLevel(user.level, 'Users Level', true)
        .setRequiredXP(neededXp)
        .setStatus(target.user.presence.status)
        .setProgressBar("#FFA500", "COLOR")
        .setUsername(target.user.username)
        .setDiscriminator(target.user.discriminator)
        .setRank(user.level, "Rank", false)
        .setBackground(`COLOR`, `#000000`);
    rank.build().then((data) => {
        const attachment = new MessageAttachment(data, "rank.png");
        message.channel.send(attachment);
    });

}

export const name: string = 'level';
export const category: string = 'Levels';
export const description: string = 'Check yours or another users level.';
export const aliases: string[] = ['rank'];
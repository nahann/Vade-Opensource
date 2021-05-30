import type { RunFunction } from '../../interfaces/Command';
import db from '../../models/Invites/inviter';

export const run: RunFunction = async(client, message, _args) => {

    let embed = new client.embed()
        .setClear()
        .setIcon(message.guild)
        .setTimestamp();
    let data = await db.find({ guildID: message.guild.id }).sort({ total: -1 });
    if (!data.length)
        return message.channel.send(
            embed.setDescription("No invite data found!")
        );
    let arr = [];
    data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
    let index = arr.findIndex((x) => x.id == message.author.id) + 1;

    let list = data
        .filter((x) => message.guild.members.cache.has(x.userID))
        .splice(0, 10)
        .map(
            (x, index) =>
                `${
                    x.userID === message.author.id
                        ? `**${index + 1}. <@${x.userID}> - Total ${x.total} Invites (${
                            x.regular
                        } Regular, ${x.bonus} Bonus, ${x.fake} Fake, ${x.leave} Left)**`
                        : `**${index + 1}.** <@${x.userID}> - Total **${
                            x.total
                        }** Invites \`(${x.regular} Real, ${x.bonus} Bonus, ${
                            x.fake
                        } Fake, ${x.leave} Left)\``
                }`
        )
        .join("\n");

    const veri = await db.findOne({
        guildID: message.guild.id,
        userID: message.author.id,
    });
    if (index < 10) {
        embed.setTitle("Invite Leaderboard");
        embed.setDescription(list);
        message.channel.send(embed);
    } else {
        embed.setTitle("Invite Leaderboard");
        embed.setDescription(
            `${list} \n... \n**${index}. ${message.author} Total ${veri.total} Invites (${veri.regular} Real, ${veri.bonus} Bonus, ${veri.fake} Fake, ${veri.leave} Left)**`
        );
        message.channel.send(embed);
    }
    
}

export const name: string = 'inviteleaderboard';
export const category: string = 'Utility';
export const description: string = 'Check the top 10 Inviters with this Command!';
export const aliases: string[] = ['invboard'];
import type { RunFunction } from '../../interfaces/Command';
import inviterSchema from '../../models/Invites/inviter';
import inviteMemberSchema from '../../models/Invites/inviteMember';

export const run: RunFunction = async(client, message, args) => {

    const member = await client.utils.getMember(message, args[0], true);
    if (!member) return;
    const inviterData = await inviterSchema.findOne({
        guildID: message.guild.id,
        userID: member.user.id,
    });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;
    const invMember = await inviteMemberSchema.find({
        guildID: message.guild.id,
        inviter: member.user.id,
    });
    const daily = invMember
        ? message.guild.members.cache.filter(
            (m) =>
                invMember.some((x) => x.userID === m.user.id) &&
                Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24
        ).size
        : 0;
    const weekly = invMember
        ? message.guild.members.cache.filter(
            (m) =>
                invMember.some((x) => x.userID === m.user.id) &&
                Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7
        ).size
        : 0;

    const embed = new client.embed()
        .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
        .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
        .setDescription(
            `
          Total **${total}** Invites. \n\n**${regular}** Regular, **${bonus}** Bonus, **${leave}** Left, **${fake}** Fake
          
          Daily: **${daily}**, Weekly: **${weekly}**
          `
        )
        .setClear()
        .setTimestamp();

    message.channel.send(embed);

    
}

export const name: string = 'invites';
export const category: string = 'Utility';
export const description: string = 'Check a users Invites!';
export const aliases: string[] = ['checkinvites'];
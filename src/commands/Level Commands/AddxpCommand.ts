import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0], true);
    if(!target) return;
    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
        return client.utils.sendError(
            `You need to specify how much XP you want to add to user!`, message.channel
        );
    if (amount > 100000)
        return message.channel.send(
            `You cannot add more than 100,000 XP at a time!`
        );
    if (amount < 1)
        return message.channel.send(`You cannot add less than 1 XP.`);

    if (!target) return;

    await client.utils.appendXp(
        target.id,
        message.guild.id,
        amount
    );
    return client.utils.succEmbed(
        `Successfully added **${amount}** XP to ${target.user.tag}!`, message.channel
    );



}

export const name: string = 'addxp';
export const category: string = 'Levels';
export const description: string = 'Add an amount of xp to a user.';
export const aliases: string[] = ['axp'];
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;
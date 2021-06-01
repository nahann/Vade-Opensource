import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0], true);
    if(!target) return;

    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
        return client.utils.sendError(
            `You need to specify what XP amount you wish to set the user to!`, message.channel
        );
    if (amount > 500000)
        return message.channel.send(`A users XP cannot be higher than 500,000!`);
    if (amount < 1)
        return message.channel.send(`You cannot set someones XP to less than 1!`);

    if (!target) return;

    await client.utils.setXp(
        target.id,
        message.guild.id,
        amount
    );
    return client.utils.succEmbed(
        `Successfully set ${target.user.tag}'s XP to **${amount}**!`, message.channel
    );

}

export const name: string = 'setxp';
export const category: string = 'Levels';
export const description: string = 'Set a users xp.';
export const aliases: string[] = ['sxp'];
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;
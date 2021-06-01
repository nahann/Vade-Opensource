import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0], true);
    if(!target) return;
    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
        return client.utils.sendError(
            `You need to specify how many levels you want to remove from the user!`, message.channel
        );
    if (amount > 1000)
        return message.channel.send(
            `You cannot remove more than 1,000 levels at a time!`
        );
    if (amount < 1)
        return message.channel.send(`You cannot remove less than 1 level.`);

    if (!target) return;

    await client.utils.subtractLevel(
        target.id,
        message.guild.id,
      amount
    );
    return client.utils.succEmbed(
        `Successfully removed **${amount}** levels from ${target.user.tag}!`, message.channel
    );

}

export const name: string = 'removelevel';
export const category: string = 'Levels';
export const description: string = 'Remove levels from a user.';
export const aliases: string[] = ['rlevel'];
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;
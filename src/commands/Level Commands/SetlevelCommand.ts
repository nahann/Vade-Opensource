import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0], true);
    if(!target) return;
    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
        return client.utils.sendError(
            `You need to specify what level you wish to set the user to!`, message.channel
        );
    if (amount > 1000)
        return message.channel.send(`A users Level cannot be higher than 1,000!`);
    if (amount < 1)
        return message.channel.send(
            `You cannot set someones Level to less than 1!`
        );

    if (!target) return;

    await client.utils.setLevel(
        target.id,
        message.guild.id,
        amount
    );
    return client.utils.succEmbed(
        `Successfully set ${target.user.tag}'s level to **${amount}**!`, message.channel
    );


}

export const name: string = 'setlevel';
export const category: string = 'Levels';
export const description: string = 'Set a users level.';
export const aliases: string[] = ['slevel'];
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;
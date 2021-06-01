import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const target = await client.utils.getMember(message, args[0], true);
    if(!target) return;
    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
        return client.utils.sendError(
            `You need to specify how many levels you want to add to the user!`, message.channel
        );
    if (amount > 1000)
        return message.channel.send(
            `You cannot add more than 1,000 levels at a time!`
        );
    if (amount < 1)
        return message.channel.send(`You cannot add less than 1 levels.`);

    if (!target) return;

    await client.utils.appendLevel(
        target.id,
        message.guild.id,
        amount
    );
    return client.utils.succEmbed(
        `Successfully added **${amount}** levels to ${target.user.tag}!`, message.channel
    );


}

export const name: string = 'addlevel';
export const category: string = 'Levels';
export const description: string = 'Add an amount of levels to a user.';
export const aliases: string[] = ['alevel'];
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;
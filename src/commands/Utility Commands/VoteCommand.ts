import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    let embed = new client.embed()
    .setTitle(`Vote for Vade!`)
    .setDescription(`[top.gg](https://top.gg/bot/782309258620305438#/)\n[Discord Bot List](https://discordbotlist.com/bots/vade)`)
    .setTimestamp()
    .setClear();

    return message.channel.send(embed);

    }
export const name: string = 'vote';
export const category: string = 'Utility';
export const description: string = 'Get the links to vote for the Bot!';
export const aliases: string[] = ['voting'];

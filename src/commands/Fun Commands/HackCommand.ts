import { RunFunction } from '../../interfaces/Command';
import ms from 'ms';

   export const run: RunFunction = async(client, message, args) => {

    const toHack = await client.utils.getMember(message, args[0]);

    let msg = await message.channel.send(`Hacking ${toHack}...`);
    let time = "3s";
    setTimeout(function () {
      msg.edit(`Finding ${toHack.displayName}'s Email...`);
    }, ms(time));
    let time1 = "6s";
    setTimeout(function () {
      msg.edit(`Email: ${toHack.user.tag}@gmail.com`);
    }, ms(time1));
    let time2 = "9s";
    setTimeout(function () {
      msg.edit(`\`\`\`Password: ******\`\`\``);
    }, ms(time2));


    }
export const name: string = 'hack';
export const category: string = 'Fun';
export const description: string = 'Pretend to hack a users password and email!';
export const aliases: string[] = ['hackuser'];

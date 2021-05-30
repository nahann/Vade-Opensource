import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {

    const user = await client.utils.getMember(message, args[0], true);
    if(!user) return;

    message.channel.send(
        `${user} You got a cuddle from ${message.author.username} ❤`,
        {
          embed: {
            image: {
              url: "https://i.imgur.com/0yAIWbg.gif",
            },
          },
        }
      );

    }
export const name: string = 'cuddle';
export const category: string = 'Fun';
export const description: string = 'Snuggle up next to someone of your choice!';
export const aliases: string[] = ['snuggle'];

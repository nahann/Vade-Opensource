import { RunFunction } from '../../interfaces/Command';
import snekfetch from 'snekfetch';

   export const run: RunFunction = async(client, message, args) => {


    const member = await client.utils.getMember(message, args[0], true);
    if(!member) return;

   await snekfetch
      .get("https://nekos.life/api/kiss")
      .set("Key", "dnZ4fFJbjtch56pNbfrZeSRfgWqdPDgf")
      .then((r) =>
        message.channel.send(
          `${member} You got a kiss from ${message.author.username} ❤`,
          {
            embed: {
              image: {
                url: r.body.url,
              },
            },
          }
        )
      )
      .catch(console.error);
    }
export const name: string = '';
export const category: string = ''
export const description: string = ''
export const aliases: string[] = ['']

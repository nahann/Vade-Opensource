import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {
    if(message.channel.type !== 'text') return;
    if(!args[0] || !["encode", "decode"].includes(args[0].toLowerCase())) return client.utils.sendError(`You need to provide either "encode" or "decode".`, message.channel);
    const text = args.slice(1)?.join(" ");
    if(!text) return client.utils.sendError(`You need to provide text with the Command!`, message.channel);
    if(text.length > 228) return client.utils.sendError(`You cannot provide more than 228 characters due to Discords limitations.`, message.channel);
    return message.channel.send(
        {
          encode(char) {
            return char
              .split(" ")
              .map((str) => str.charCodeAt(0).toString(2).padStart(8, "0"))
              .join(" ");
          },
          decode(char) {
            return char
              .split(" ")
              .map((str) => String.fromCharCode(Number.parseInt(str, 2)))
              .join("");
          }
        }
          [args[0].toLowerCase()](text)
          
      );
    }
export const name: string = 'binary';
export const category: string = 'Utility';
export const description: string = 'Convert text to and from binary encryption.';

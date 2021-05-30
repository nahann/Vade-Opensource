import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {

    if (!args[0])
    return message.channel.send(
      `Please specify what you want the image to say.`
    );
  let clydeMessage = args.join(" ");
  if(!clydeMessage) return client.utils.sendError(`You need to provide some text.`, message.channel);
  let encodedLink = encodeURI(
    `https://ctk-api.herokuapp.com/clyde/${clydeMessage}`
  );

  let clydeEmbed = new client.embed().setImage(encodedLink);

  message.channel.send(clydeEmbed);


    }
export const name: string = 'clyde';
export const category: string = 'Fun';
export const description: string = 'Receive an image of Clyde the system Bot saying what you like!';
export const aliases: string[] = ['clydeimage'];

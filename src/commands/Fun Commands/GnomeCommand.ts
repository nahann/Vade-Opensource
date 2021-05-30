import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {


 
   
       //get the first person they mentioned in the message
       const user = await client.utils.getMember(message, args[0], true);
       if(!user) return;

       message.delete();
   
       //send a funny message in the channel to that person
       message.channel.send(
         `${user} Ho ho ho ha ha, ho ho ho he ha. Hello there, old chum. I’m g'not a g'nelf. I’m g'not a g'noblin. I’m a g'nome!! And you’ve been, GNOOOMED!!!`
       );

    }
export const name: string = 'gnome';
export const category: string = 'Fun';
export const description: string = 'Cheer someone up with a lovely "gnome" message.';

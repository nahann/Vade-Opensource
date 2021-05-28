import { RunFunction } from '../../interfaces/Command';
import figlet from 'figlet';

   export const run: RunFunction = async(client, message, args) => {

    
   let text = args.join(" ");
   if(!text) {
return client.utils.sendError(`Please provide text for the ascii conversion!`, message.channel);
}
   let maxlen = 20
if(text.length > maxlen) {
return client.utils.sendError(`Please put text that has 20 characters or less because the conversion won't be good!`, message.channel);
}


figlet(text, function(err, data) {
message.channel.send(data, {
code: 'AsciiArt' 
});
})

    }
export const name: string = 'ascii';
export const category: string = 'Fun';
export const description: string = 'Asciffy some text!';
export const usage: string = '!ascii <text goes here>.';

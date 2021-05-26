import { Message } from "discord.js-light";
import arrays from '../Assets/Automod/messages.json';





export namespace automod {

export function checkMessage(message: Message) {

   const banned_words = arrays.array;

   for(const msg of message.content) {
       if(banned_words.includes(msg)) return true;
   }

}


}
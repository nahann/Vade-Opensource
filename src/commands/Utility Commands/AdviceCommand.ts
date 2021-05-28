import { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

   export const run: RunFunction = async(client, message, _args) => {

    try {
        const advice = await fetch(
          "https://api.adviceslip.com/advice"
        ).then((response) => response.json());
        const embed = new client.embed().setTitle(advice.slip.advice);
        message.channel.send(embed);
        message.channel.stopTyping();
      } catch (err) {
        console
          .log(err)
           client.utils.sendError(
              "Error occurred! I have automatically sent this my developers, so no need to worry!", message.channel
            );
        
      }


    }
export const name: string = 'advice';
export const category: string = 'Utility';
export const description: string = 'Have some advice given to you.';

import { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

   export const run: RunFunction = async(client, message, args) => {

    try {
        const fox = await fetch("https://randomfox.ca/floof/").then((response) =>
          response.json()
        );
        const embed = new client.embed().setImage(fox.image).setClear();
  
        message.channel.send(embed);
      } catch (err) {
        console.log(err);
      }


    }
export const name: string = 'fox';
export const category: string = 'Fun'
export const description: string = 'Receive an image of a fox.';

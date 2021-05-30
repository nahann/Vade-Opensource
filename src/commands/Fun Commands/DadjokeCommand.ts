import type { RunFunction } from '../../interfaces/Command';;
import getJoke from 'give-me-a-joke';

   export const run: RunFunction = async(_client, message, _args) => {

    getJoke.getRandomDadJoke(function (joke) {
        return message.channel.send(joke);
      });

    }
export const name: string = 'dadjoke';
export const category: string = 'Fun';
export const description: string = 'Have a random dad joke sent into the chat!';
export const aliases: string[] = ['badjoke'];

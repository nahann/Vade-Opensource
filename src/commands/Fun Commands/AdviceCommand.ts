import type { RunFunction } from '../../interfaces/Command';;
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, _args) => {

    try {
        await message.channel.startTyping();
        const advice = await fetch(
            "https://api.adviceslip.com/advice"
        ).then((response) => response.json());
        const embed = new client.embed().setTitle(advice.slip.advice);
        await message.channel.send(embed);
        message.channel.stopTyping();
    } catch (err) {
        console.log(err)
               await message.reply(
                    "Error occurred! I have automatically sent this my developers, so no need to worry!"
                );

    }

}

export const name: string = 'advice';
export const category: string = 'Fun';
export const description: string = 'Receive a piece of advice.';
export const aliases: string[] = ['advise'];
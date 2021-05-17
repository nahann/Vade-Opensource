import { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

   export const run: RunFunction = async(client, message, args) => {

        const data = await fetch("https://nekobot.xyz/api/image?type=anal")
        if(!data) return client.utils.sendError(`An unknown error has occured.`, message.channel);
        console.log(data)
        
     


    }
export const name: string = 'anal';
export const category: string = 'NSFW'
export const description: string = 'Anal - Porn.';

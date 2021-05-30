import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {

    }
export const name: string = 'lock';
export const category: string = 'Administrative';
export const description: string = 'Lock a channel.';
export const aliases: string[] = ['channellock'];
export const userPerms: string[] = ['MANAGE_CHANNELS'];
export const botPerms: string[] = ['MANAGE_CHANNELS'];

import type { RunFunction } from '../../interfaces/Command';;

export const run: RunFunction = async(client, message, args) => {

if(!args.length) return client.utils.sendError(`You need to provide a role name.`, message.channel);


}

export const name: string = 'createrole';
export const category: string = 'Administrative';
export const description: string = 'Create a role in the current server.';
export const aliases: string[] = ['makerole'];
export const userPerms: string[] = ['MANAGE_ROLES'];
export const botPerms: string[] = ['MANAGE_ROLES'];
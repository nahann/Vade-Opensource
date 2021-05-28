import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(_c, _m, _a) => {

}

export const name: string = 'nickname';
export const category: string = 'Moderation';
export const description: string = 'Set a users nickname to the one specified.';
export const aliases: string[] = ['nick'];

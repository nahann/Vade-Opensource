import type { RunFunction } from '../../interfaces/Command'
// @ts-ignore
import Calculator from '../../utils/Calculator';

export const run: RunFunction = async(client, message, args) => {

    await Calculator(message);

}

export const name: string = 'math';
export const category: string = 'Utility';
export const description: string = 'Utilise an interactive calculator!';
export const aliases: string[] = ['calculator'];

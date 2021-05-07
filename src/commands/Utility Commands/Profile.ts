import { RunFunction } from '../../interfaces/Command';
import mainUser from '../../../models/economy';

   export const run: RunFunction = async(client, message, args) => {

    }
export const name: string = 'profile';
export const category: string = 'Utility';
export const description: string = 'Check a users economy-specific profile.';
export const aliases: string[] = ['econprofile'];

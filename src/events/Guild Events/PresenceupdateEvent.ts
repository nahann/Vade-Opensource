import { RunFunction } from '../../interfaces/Event';

   export const run: RunFunction = async(client, oldPresence, newPresence) => {

    console.log(oldPresence);
    console.log(newPresence);



    }
export const name: string = 'presenceUpdate';
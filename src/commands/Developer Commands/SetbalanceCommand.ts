import { RunFunction } from '../../interfaces/Command';
import profileSchema from '../../models/profile';

   export const run: RunFunction = async(client, message, args) => {

    const member = await client.utils.getMember(message, args[0], true);

    if(!member) return; 

    const findSchema = await profileSchema.findOne({ User: member.id });
    if(!findSchema) return  client.utils.sendError(`No data found.`, message.channel);

    const amount = parseInt(args[1]);
    const type = ["bank", "wallet"];

    if(!amount || Number.isNaN(+amount)) return client.utils.sendError(`No amount specified.`, message.channel);
    if(!type.includes(args[2]?.toLowerCase())) return client.utils.sendError(`"wallet" or "bank" needs to be specified.`, message.channel);

    if(args[2]?.toLowerCase() === 'bank') {
        await findSchema.updateOne({
            Bank: amount,
        });

        return client.utils.succEmbed(`Successfully completed that action.`, message.channel);

    } else if (args[2]?.toLowerCase() === 'wallet') {
        await findSchema.updateOne({
            Wallet: amount
        });

        return client.utils.succEmbed(`Successfully completed that action.`, message.channel);

    } else if (args[2]?.toLowerCase() === 'both') {
        await findSchema.updateOne({
            Wallet: amount,
            Bank: amount,
        });
        
        return client.utils.succEmbed(`Successfully completed that action.`, message.channel);
    }


   





    }
export const name: string = 'setbalance';
export const category: string = 'Development';
export const description: string = 'Set a users balance to the amount specified.';
export const aliases: string[] = ['sbal'];
export const devOnly: boolean = true;
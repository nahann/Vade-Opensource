import { RunFunction } from '../../interfaces/Command';
import profile from '../../models/profile';

   export const run: RunFunction = async(client, message, args) => {

    const check = await profile.findOne({ User: message.author.id });

    if(check && check.MentionNotif) {
        await check.updateOne({
            MentionNotif: false,
        });

        return client.utils.succEmbed(`Successfully disabled mention notifications!`, message.channel);
    } else if(check && !check.MentionNotif) {
        await check.updateOne({
            MentionNotif: true,
        });

        return client.utils.succEmbed(`Successfully enabled mention notifications!`, message.channel);

    } else if(!check) {
       const newProf = new profile({
           User: message.author.id,
           Wallet: 0,
           Bank: 0,
           MentinNotif: true
       });

       await newProf.save();

       return client.utils.succEmbed(`Successfully enabled mention notifications!`, message.channel);
    }


    }
export const name: string = 'mentionnotifications';
export const category: string = 'Utility';
export const description: string = 'Receive notifications via DM if someone pings you in a server.';
export const aliases: string[] = ['mentionnotif'];
export const cooldown: number = 5000;
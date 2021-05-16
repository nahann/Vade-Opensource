import { RunFunction } from '../../interfaces/Command';
import profile from '../../models/profile';

   export const run: RunFunction = async(client, message, args) => {

    
    let embed = new client.embed()
    .setClear()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle('Tossing the coin...')
    .setThumbnail('https://hackel.xyz/img/coinflip.gif');

message.channel.send(embed).then(async (msg) => {
    setTimeout(async () => {
        let newEmbed = new client.embed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setClear()
            .setTimestamp();

        let edgeCheck = getRandomInt(6000);
        let sideCheck = getRandomInt(2);
        
        if (edgeCheck === 0) {
            newEmbed
                .setTitle('Your coin landed on its edge!')
                .setDescription(
                    'Congratulations on winning the **1/6000** chance of it happening! Enjoy a complimentary $500 added to your Wallet!'
                )
                .setThumbnail('https://media.discordapp.net/attachments/806698907719434240/843627826854887425/kSoXk4n3nJRK7ilnPSX2jdW9bhP2RPOnLon2uFW-nEWN_69-6fgikMFz90LfDQrqplWPrke6Mc_GI2ivvC2ok56s-4KYDvRPGD2W.png?width=410&height=342');

                const profileCheck = await profile.findOne({ User: message.author.id });
                if(profileCheck) {
                    await profileCheck.updateOne({
                        $inc: { Wallet: 10000 }
                    });

                }
                
        } else {
            if (sideCheck === 0) {
                newEmbed
                    .setTitle('Your coin landed on its head!')
                    .setThumbnail('https://media.discordapp.net/attachments/806698907719434240/843627826854887425/kSoXk4n3nJRK7ilnPSX2jdW9bhP2RPOnLon2uFW-nEWN_69-6fgikMFz90LfDQrqplWPrke6Mc_GI2ivvC2ok56s-4KYDvRPGD2W.png?width=410&height=342');
            } else {
                newEmbed
                    .setTitle('Your coin landed on its tail!')
                    .setThumbnail('https://media.discordapp.net/attachments/806698907719434240/843627826854887425/kSoXk4n3nJRK7ilnPSX2jdW9bhP2RPOnLon2uFW-nEWN_69-6fgikMFz90LfDQrqplWPrke6Mc_GI2ivvC2ok56s-4KYDvRPGD2W.png?width=410&height=342');
            }
        }
        msg.edit(newEmbed);
    }, 1 * 1000);
});



    }
export const name: string = 'coinflip';
export const description: string = 'Flip a coin!';
export const aliases: string[] = ['cf'];


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
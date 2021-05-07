import { RunFunction } from '../../interfaces/Command';
import { DiscordTogether } from '../../../utils/index';


   export const run: RunFunction = async(client, message, args) => {
    const discordTogether = new DiscordTogether(client, { token: client.config.token } );

    discordTogether.createTogetherCode(message.member.voice.channelID, 'betrayal').then(async invite => {
        return message.channel.send(`[LINK](${invite.code})`);
         });

    }
export const name: string = 'watchparty';
export const category: string = 'Fun';
export const description: string = 'Big boi test';
export const aliases: string[] = ['test'];

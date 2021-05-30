import type { RunFunction } from '../../interfaces/Command';
import translate from '@iamtraction/google-translate'

export const run: RunFunction = async(client, message, args) => {

    try {
        if (args.length < 2) {
            return client.utils.sendError(
                "Command Usage: `translate <Language> <Text>`", message.channel
            );
        }

        const result = await translate(args.slice(1).join(" "), { to: args[0] });

        const embed = new client.embed()
            .setColor("#68b64a")
            .setDescription(`Original text: ${args.slice(1).join(" ")} \n\nTranslation: ${result.text}`)
            .setFooter(
                `Translation from ${result.from.language.iso.toUpperCase()} to ${args[0].toUpperCase()}`
            );
        message.channel.send({ embed });
    } catch (err) {
        return client.utils.sendError(
            `Oh no, an error occurred: \`${err.message}\`.`, message.channel
        );
    }



}

export const name: string = 'translate';
export const category: string = 'Utility';
export const description: string = 'Translate text into the provided language.';
export const aliases: string[] = ['translation']
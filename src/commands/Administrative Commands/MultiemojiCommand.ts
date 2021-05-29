import type {RunFunction} from '../../interfaces/Command';
import {Util} from "discord.js-light";

export const run: RunFunction = async (client, message, args) => {

    const emojis = args.join(" ").match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gi);
    if (!emojis)
        return client.utils.sendError(
            `Pleas ensure that you are providing Emojis. This command only works with nitro emojis.`, message.channel
        );
    const msg = await message.channel.send(`Please Wait!`);
    message.channel.send("test")

    emojis.forEach((emote) => {
        let emoji = Util.parseEmoji(emote);
        if (emoji.id) {
            const Link = `https://cdn.discordapp.com/emojis/${emoji.id}.${
                emoji.animated ? "gif" : "png"
            }`;

            message.guild.emojis
                .create(`${Link}`, `${`${emoji.name}`}`)
                .then((em) => {
                    msg.delete();
                    message.react("✅");
                    message.channel
                        .send(`${em} Added with name \`${em.name}\``)
                        .catch((error) => {
                            message.channel.send("An Error Occured. ");
                            console.log(error);
                        });
                });
        }
    });

}

export const name: string = 'multiemoji';
export const category: string = 'Administrative';
export const description: string = 'Upload multiple nitro emojis from this Command!';
export const aliases: string[] = ['emojiadd'];
export const userPerms: string[] = ["MANAGE_EMOJIS"];
export const botPerms: string[] = ['MANAGE_EMOJIS'];
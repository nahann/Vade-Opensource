import type { RunFunction } from '../../interfaces/Command';
import request from 'node-superfetch';
import canvas from '../../Classes/Canvas';
import { createCanvas, loadImage } from "canvas";

export const run: RunFunction = async(client, message, args) => {

    const { greyscale } = canvas;

    const msg = message;
    const member = await client.utils.getMember(message, args[0], true);
    if (!member) return;
    const image = member.user.displayAvatarURL({ format: "png", size: 512 });

    try {
        const { body } = await request.get(image);
        // @ts-ignore
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        greyscale(ctx, 0, 0, data.width, data.height);
        const attachment = canvas.toBuffer();
        if (Buffer.byteLength(attachment) > 8e6)
            return msg.reply("Resulting image was above 8 MB.");
        return msg.channel.send({
            files: [{ attachment, name: "greyscale.png" }],
        });
    } catch (err) {
        return msg.reply(
            `Oh no, an error occurred: \`${err.message}\`. Try again later!`
        );
    }

}

export const name: string = 'greyscale';
export const category: string = 'Image Manipulation';
export const description: string = 'Apply a "greyscale" effect to a users avatar.';
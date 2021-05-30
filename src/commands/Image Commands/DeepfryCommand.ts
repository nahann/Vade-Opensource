import type { RunFunction } from '../../interfaces/Command';
import canvas from '../../Classes/Canvas';
import { createCanvas, loadImage } from "canvas";
import request from 'node-superfetch';

export const run: RunFunction = async(client, message, args) => {

    const { desaturate, contrast } = canvas;
    const member = await client.utils.getMember(message, args[0], true);
    if(!member) return;
    const image = member.user.displayAvatarURL({ format: "png", size: 512 });
    const msg = message;

    try {
        const { body } = await request.get(image);
        // @ts-ignore
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        desaturate(ctx, -20, 0, 0, data.width, data.height);
        contrast(ctx, 0, 0, data.width, data.height);
        const attachment = canvas.toBuffer("image/jpeg", { quality: 0.2 });
        if (Buffer.byteLength(attachment) > 8e6)
            return msg.reply("Resulting image was above 8 MB.");
        return msg.channel.send({
            files: [{ attachment, name: "deep-fry.jpeg" }],
        });
    } catch (err) {
        return msg.reply(
            `Oh no, an error occurred: \`${err.message}\`. Try again later!`
        );
    }

}

export const name: string = 'deepfry';
export const category: string = 'Image Manipulation';
export const description: string = 'Assign a "deepfry" effect to the users avatar.';
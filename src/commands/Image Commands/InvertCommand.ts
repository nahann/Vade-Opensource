import { RunFunction } from '../../interfaces/Command';
import { createCanvas, loadImage } from "canvas";
import request from 'node-superfetch';
import canvas from '../../Classes/Canvas';

export const run: RunFunction = async(client, message, _args) => {

    const { invert } = canvas;

    const msg = message;
    let attachments = message.attachments.array();
    if (attachments.length === 0)
        return client.utils.sendError(
            `Incorrect usage: !invert <message attachment>`, message.channel
        );
    else if (attachments.length > 1)
        return client.utils.sendError("Please only do one image at a time.", message.channel);
    const image = attachments[0].url;

    try {
        const { body } = await request.get(image);
        // @ts-ignore
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(data, 0, 0);
        invert(ctx, 0, 0, data.width, data.height);
        const attachment = canvas.toBuffer();
        if (Buffer.byteLength(attachment) > 8e6)
            return msg.reply("Resulting image was above 8 MB.");
        return msg.channel.send({ files: [{ attachment, name: "invert.png" }] });
    } catch (err) {
        return msg.reply(
            `Oh no, an error occurred: \`${err.message}\`. Try again later!`
        );
    }

}

export const name: string = 'invert';
export const category: string = 'Image Manipulation';
export const description: string = 'Invert the provided image.';
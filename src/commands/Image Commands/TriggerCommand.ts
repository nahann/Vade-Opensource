import type { RunFunction } from '../../interfaces/Command';
import path from 'path';
import { createCanvas, loadImage } from "canvas";
import request from 'node-superfetch';
import GIFEncoder from 'gifencoder';
import canvas from '../../Classes/Canvas';

const coord1 = [-25, -33, -42, -14];
const coord2 = [-25, -13, -34, -10];


export const run: RunFunction = async(client, message, args) => {

    const streamToArray = client.utils.streamToArray;
    const { drawImageWithTint } = canvas;

    const msg = message;
    const member = await client.utils.getMember(message, args[0], true);
    if(!member) return;
    const user = member?.user;

    const avatarURL = user.displayAvatarURL({ format: "png", size: 512 });

    try {
        const base = await loadImage(
            path.join(__dirname, "..", "..", "Assets", "Images", "Triggered.png")
        );
        const { body } = await request.get(avatarURL);
        // @ts-ignore
        const avatar = await loadImage(body);
        const encoder = new GIFEncoder(base.width, base.width);
        // @ts-ignore
        const canvas = createCanvas(base.width, base.width);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, base.width, base.width);
        const stream = encoder.createReadStream;
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(200);
        for (let i = 0; i < 4; i++) {
            drawImageWithTint(ctx, avatar, "red", coord1[i], coord2[i], 300, 300);
            ctx.drawImage(base, 0, 218, 256, 38);
            encoder.addFrame(ctx);
        }
        encoder.finish();
        const buffer = await streamToArray(stream);

        return msg.channel.send({
            // @ts-ignore
            files: [{ attachment: Buffer.concat(buffer), name: "triggered.gif" }],
        });
    } catch (err) {
        return msg.reply(
            `Oh no, an error occurred: \`${err.message}\`. Try again later!`
        );
    }




}

export const name: string = 'trigger';
export const category: string = 'Image Manipulation';
export const description: string = '"Trigger" a users avatar.';
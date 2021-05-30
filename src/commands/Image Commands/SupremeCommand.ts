import type { RunFunction } from "../../interfaces/Command";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";
import { MessageAttachment } from "discord.js";

export const run: RunFunction = async (client, message, args) => {
  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;

  const Canvas = createCanvas(394, 504);

  const ctx = Canvas.getContext("2d");
  const profile_img = await loadImage(
    join(__dirname, "../../Assets/Images/Supreme.png")
  );
  ctx.drawImage(profile_img, 0, 78, Canvas.width, 425);
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";

  const avatar = await loadImage(
    member.user.displayAvatarURL({ format: "png" })
  );
  ctx.beginPath();
  ctx.arc(195, 70, 68, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  // @ts-ignore
  ctx.lineTo(avatar, 250, 150);
  ctx.drawImage(avatar, 125, 0, 140, 140);

  const attachment = new MessageAttachment(Canvas.toBuffer(), "supreme.png");
  return message.channel.send(attachment);
};

export const name: string = "supreme";
export const category: string = "Image Manipulation";
export const description: string =
  'Returns an image of the users avatar with a "supreme" effect!';

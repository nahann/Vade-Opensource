import { Message } from "discord.js";
import { RunFunction } from "../../interfaces/Command";
import Screenshotter from "discord-screenshot";

export const run: RunFunction = async (client, message, args) => {
       const res = await Screenshotter.screenshot(args[0])
       message.channel.send({ files: [res] })
};

export const name: string = "screenshot";
export const aliases: string[] = ["ss"];
export const category: string = "Information";

import { RunFunction } from "../../interfaces/Command";
import { MessageButton } from "../../utils/buttons/src";

export const run: RunFunction = async (client, message, args) => {
  let btn = new MessageButton()
    .setStyle("red")
    .setLabel("Kinda cool")
    .setID("test");
    // @ts-ignore
  message.channel.send(`test`, { buttons: [btn] });
};
export const name: string = "test";
export const category: string = "Development";
export const description: string = "Test for Discord's Buttons";

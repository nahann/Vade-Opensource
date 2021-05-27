import { RunFunction } from "../../interfaces/Command";
import { MessageButton } from "../../utils/buttons/src";
import type MsgBtn from "../../utils/Buttons/typings/Classes/MessageButton";

export const run: RunFunction = async (client, message, args) => {
  let btn: MsgBtn = new MessageButton()
    .setStyle("red")
    .setLabel("Kinda cool")
    .setID("test");
    // @ts-ignore
    
  message.channel.send(`test`, { buttons: [btn] });

  btn.on("click", (data) => {
    message.channel.send("penis")
  })
};
export const name: string = "test";
export const category: string = "Development";
export const description: string = "Test for Discord's Buttons";

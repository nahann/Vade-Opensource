import { MessageButton, ButtonStyle } from "../../utils/buttons/src/v12/Classes/MessageButton";

import type { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, _args) => {
  let btn = new MessageButton()
    .setStyle(ButtonStyle.Danger)
    .setLabel("Kinda cool")
    .setID("test");
    // @ts-ignore
    
  message.channel.send(`test`, { buttons: [btn] });

  btn.on("click", (_data) => {
    console.log(client.utils.hasVoted(message.author.id))
  })

};
export const name: string = "test";
export const category: string = "Development";
export const description: string = "Test for Discord's buttons";

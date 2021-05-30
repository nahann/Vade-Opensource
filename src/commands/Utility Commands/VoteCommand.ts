import { RunFunction } from "../../interfaces/Command";
import { MessageButton } from "../../utils/buttons/src";

export const run: RunFunction = async (client, message, args) => {
  let embed = new client.embed()
    .setTitle(`Vote for Vade!`)
    .setDescription(
      `[top.gg](https://top.gg/bot/782309258620305438#/)\n[Discord Bot List](https://discordbotlist.com/bots/vade)`
    )
    .setTimestamp()
    .setClear();

  let button = new MessageButton()
    .setStyle(5)
    .setURL("https://top.gg/bot/782309258620305438")
    .setLabel("Top.gg");

  let button2 = new MessageButton()
    .setStyle(5)
    .setURL("https://discordbotlist.com/bots/vade")
    .setLabel("Discord Bot List");

  // @ts-ignore
  return message.channel.send(`You can vote at the following!`, {
        // @ts-ignore
    buttons: [button, button2],
  });
};
export const name: string = "vote";
export const category: string = "Utility";
export const description: string = "Get the links to vote for the Bot!";
export const aliases: string[] = ["voting"];

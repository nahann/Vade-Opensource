import { Message } from "discord.js";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message) => {
  const msg: Message = await message.channel.send(
    new client.embed().setDescription("Pinging...").setMainColor()
  );
  await msg.edit(
    new client.embed()
      .setDescription(`Websocket: ${client.ws.ping}MS`)
      .setMainColor()
  );
};

export const name: string = "ping";
export const aliases: string[] = ["pong"];
export const category: string = "Information";

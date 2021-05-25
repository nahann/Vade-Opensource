
import { StarboardManager } from "../../utils/StarboardManager";
import type { Message } from "discord.js-light";
import type { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, message: Message) => {
  if(message.partial) await message.fetch();
  if(!message.content) return;
  StarboardManager.onRemoveAll(message);
  
}

export const name: string = "messageDelete"

import { StarboardManager } from "../../utils/StarboardManager";
import type { Message } from "discord.js-light";
import type { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, message: Message) => {
  if (!message) return;
  if(!message.deleted) return;
  if (message.partial) await message.fetch();
  if (!message.content?.length || !message.guild || message.author.bot) return;
 await StarboardManager.onRemoveAll(message);
};

export const name: string = "messageDelete";

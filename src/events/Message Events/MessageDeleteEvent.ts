import { StarboardManager } from "../../utils/StarboardManager";
import type { Message } from "discord.js-light";
import type { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, message: Message) => {
  if (!message) return;
  if (message.partial) await message.fetch();
  if (!message.content || !message.guild || message.author.bot) return;
  StarboardManager.onRemoveAll(message);
};

export const name: string = "messageDelete";

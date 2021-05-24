import { StarboardManager } from "../../utils/StarboardManager";

import type { Message } from "discord.js-light";
import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";

export const run: RunFunction = async (client: Bot, message: Message) => {
  await StarboardManager.onRemoveAll(message);
}

export const name: string = 'messageReactionRemoveAll'

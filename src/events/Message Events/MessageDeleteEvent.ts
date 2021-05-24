
import { StarboardManager } from "../../utils/StarboardManager";

import type { Message } from "discord.js";
import type { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client, message: Message) => {
  StarboardManager.onRemoveAll(message);
  
}

export const name: string = "messageDelete"

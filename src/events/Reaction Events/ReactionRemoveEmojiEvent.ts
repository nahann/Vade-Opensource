import { StarboardManager } from "../../utils/StarboardManager";

import type { MessageReaction } from "discord.js";
import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";

export const run: RunFunction = async (
  client: Bot,
  reaction: MessageReaction
) => {
  await StarboardManager.onRemoveEmoji(reaction);
};

export const name: string = "messageReactionRemoveEmoji";

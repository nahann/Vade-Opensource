import type { SlashCommand } from "../Classes/types";

export default {
  name: "ping",
  description: "See the bot's ping.",
  async execute(_client, _interaction, methods) {
    await methods.respond({ content: "Pong!" });
  },
} as SlashCommand;

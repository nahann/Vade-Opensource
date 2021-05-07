import { SlashCommand } from "../Classes/types";

export default {
  name: "ping",
  description: "See the bot's ping.",
  execute(client, interaction, methods) {
    methods.respond({
      content: "Pong!",
    });
  },
} as SlashCommand;

import { SlashCommand } from "../Classes/types";
import { inspect } from "util";
import { Bot } from "../client/Client";

export default {
    name: "help",
    description: "Recieve help on all commands or singular commands.",
    options: [
        {
          type: 3,
          name: "command",
          choices: [
            {
              name: "Moderation",
              value: "moderation",
              description: "View the Commands in the Moderation category.",
            },
          ],
          description: "View the help menu of a command or category.",
          required: false,
        },
      ],
    execute(client, interaction, methods) {
        const selection = interaction.data?.options[0].value;
        methods.respond({
            content: `Pong! ${interaction.data.options[0].value}`,
        });
    },
} as SlashCommand;

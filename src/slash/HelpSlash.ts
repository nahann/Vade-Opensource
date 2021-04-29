import { SlashCommand } from "../Classes/types";
import { inspect } from "util";
import { Bot } from "../client/Client";
import { client } from '../interfaces/Command';

export default {
    name: "help",
    description: "Recieve help on all commands or singular commands.",
    options: [
        {
          type: 3,
          name: "command",
          choices: [
            client.commands.map((cmd) => ({ name: cmd.name, value: cmd.name }))

          ],
          description: "View the help menu of a command or category.",
          required: false,
        },
      ],
    execute(client, interaction, methods) {
      let option;
      const embed = new client.embed()
      .setClear()
      .setTimestamp();
        const selection = interaction.data?.options[0].value;
        const checkOrCross = (bool) =>
        bool ? client.constants.emojis.check : client.constants.emojis.x;
        if(selection) {

          const command = client.commands.get(selection);
          if(command) {
            embed.setDescription([
              `**❯** Aliases: **${
                command.aliases?.length
                  ? command.aliases.map((alias) => `\`${alias}\``).join(" ")
                  : "No aliases."
              }**`,
              `**❯** Description: **${command.description}**`,
              `**❯** Category: **${command.category}**`,
              `**❯** Usage: **${command.usage}**`,
              `**❯** Required Permissions: **${
                command.userPerms?.length
                  ? command.userPerms.map(client.utils.formatPerms).join(", ")
                  : "No Permissions Needed."
              }**`,
              `**❯** Moderator Command: ${checkOrCross(command.modCommand)}`,
              `**❯** Administrator Command: ${checkOrCross(command.adminCommand)}`,
              `**❯** [**Premium Command:**](https://vade-bot.com/premium) ${checkOrCross(
                command.premiumOnly
              )}`,
            ]);
          }


        }
        methods.respond({
            embeds: [embed.toJSON()],
            content: `Testing`,
        });
    },
} as SlashCommand;

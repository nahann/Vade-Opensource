import { RunFunction } from "../../interfaces/Command";
import EconomySchema from "../../../models/economy";
import { Util } from "discord.js";

export const run: RunFunction = async (client, message, args) => {
  const allSchema = await EconomySchema.find({}); // Return all economy schemas
  const test = allSchema.sort((a, b) => b.Wallet - a.Wallet);

  const nf = Intl.NumberFormat();

  const medals = [":first_place:", ":second_place:", ":third_place:"];

  const embed = new client.embed()
    .setTitle(`Global Economy Leaderboard`)
    .setDescription(
      `${test
        .splice(0, 10)
        .map(
          (user, index) =>
            `${medals[index] || ":medal:"} ${Util.escapeMarkdown(
              client.users.cache.get(user.User).tag
            )} - **${nf.format(user.Wallet)}**`
        )
        .join("\n")}`
    )
    .setMainColor()
    .setTimestamp();

  message.channel.send(embed);
};

export const name: string = "leaderboard";
export const category: string = "Economy";
export const usage: string = "!leaderboard";
export const description: string = "View the Economy leaderboard!";

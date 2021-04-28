import { RunFunction } from "../../interfaces/Command";
import LotterySchema from "../../../models/lottery";
import economy_schema from "../../../models/economy";

export const run: RunFunction = async (client, message, args) => {
  const amountToEnter = 1000;

  const economy = await economy_schema.findOne({ User: message.author.id });
  let lottery = await LotterySchema.findOne();

  if (!lottery) {
    lottery = await new LotterySchema({
      pot: 0,
      entries: [],
    }).save();
  }

  if (lottery.entries.includes(message.author.id))
    return message.channel.send(`You have already entered the lottery!`);

  if (!economy || (economy.Wallet && economy.Wallet < amountToEnter))
    return message.channel.send(`You don't have enough to enter the lottery!`);

  await message.channel.send(
    `Are you sure you would like to enter the lottery? This will remove 1,000 coins from your wallet.`
  );

  try {
    const msg = await message.channel.awaitMessages(
      (m) => m.author.id === message.author.id,
      { time: 20000, max: 1, errors: ["time"] }
    );
    if (["yes", "y"].includes(msg.first().content.toLowerCase())) {
      await economy.updateOne({
        $inc: { Wallet: -amountToEnter },
      });

      await LotterySchema.findOneAndUpdate(
        {},
        {
          $inc: { pot: amountToEnter },
          $push: {
            entries: message.author.id,
          },
        }
      );

      message.channel.send(`Successfully entered into the lottery!`);
    } else {
      message.channel.send("Canceled...");
    }
  } catch (_) {
    message.channel.send("Time ran out.");
  }
};

export const name: string = "lottery";
export const category: string = "Economy";
export const description: string = "Enter the lottery!";

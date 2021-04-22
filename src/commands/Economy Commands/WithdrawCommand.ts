import { RunFunction } from "../../interfaces/Command";
import EconomySchema from "../../../models/economy";

export const run: RunFunction = async (client, message, args) => {
  const amount = args[0];
  if (!amount || isNaN(parseInt(amount)) || amount.startsWith("-"))
    return message.channel.send(`You need to specify an amount to withdraw.`);
  const Profile = await EconomySchema.findOne({ User: message.author.id });
  if (!Profile || Profile.Bank < parseInt(amount))
    return message.channel.send(`You don't have enough to withdraw.`);

  await EconomySchema.updateOne({
    User: message.author.id,
    $inc: { Bank: -parseInt(amount) },
  });
  await EconomySchema.updateOne({
    User: message.author.id,
    $inc: { Wallet: parseInt(amount) },
  });
  const nf = Intl.NumberFormat();
  message.channel.send(
    `Successfully withdrawn **${nf.format(parseInt(amount))}**!`
  );
};

export const name: string = "withdraw";
export const category: string = "Economy";
export const aliases: string[] = ["with"];
export const usage: string = "!withdraw <Amount>";

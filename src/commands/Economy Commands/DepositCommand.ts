import { RunFunction } from "../../interfaces/Command";
import EconomySchema from "../../../models/economy";

export const run: RunFunction = async (client, message, args) => {
  const amount = args[0];
  if (!amount || isNaN(parseInt(amount)) || amount.startsWith("-"))
    return message.channel.send(`You need to specify an amount to deposit.`);
  const profile = await EconomySchema.findOne({ User: message.author.id });
  if (!profile || profile.Wallet <= 0)
    return message.channel.send(`You have nothing in your Wallet to deposit.`);
  if (parseInt(amount) > profile.Wallet)
    return message.channel.send(`You don't have enough to deposit.`);

  const nf = new Intl.NumberFormat();

  await EconomySchema.updateOne({
    User: message.author.id,
    $inc: { Bank: parseInt(amount) },
  });
  await EconomySchema.updateOne({
    User: message.author.id,
    $inc: { Wallet: -parseInt(amount) },
  });
  message.channel.send(
    `You have successfully deposited **${nf.format(parseInt(amount))}**!`
  );
};

export const name: string = "deposit";
export const aliases: string[] = ["dep"];
export const category: string = "economy";
export const cooldown: number = 15000;
export const usage: string = "!deposit <Amount>";

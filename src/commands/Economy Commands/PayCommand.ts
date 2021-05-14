import { RunFunction } from "../../interfaces/Command";
import main_schema from "../../models/profile";

export const run: RunFunction = async (client, message, args) => {
  const nf = Intl.NumberFormat();

  const locate_schema = await main_schema.findOne({ User: message.author.id });
  if (!locate_schema)
    return message.channel.send(`You don't have any money to give!`);
  const amountToGive = args[1] ? parseInt(args[1]) : 0;

  if (amountToGive <= 0)
    return message.channel.send(`You need to specify a valid amount to give!`);
  if (!locate_schema.Wallet || locate_schema.Wallet < amountToGive)
    return message.channel.send(`You don't have enough to give!`);
  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;
  const locate_schema_2 = await main_schema.findOne({ User: member.id });
  if (!locate_schema_2) {
    const newSchema = new main_schema({
      User: member.id,
      Wallet: amountToGive,
      Bank: 0,
    });

    await newSchema.save();

    await locate_schema.updateOne({
      $inc: { Wallet: -amountToGive },
    });

    return message.channel.send(
      `Successfully given ${member.user.tag} **$${nf.format(
        amountToGive
      )}** and deducted it from your Wallet!`
    );
  } else {
    await locate_schema_2.updateOne({
      $inc: { Wallet: amountToGive },
    });

    await locate_schema.updateOne({
      $inc: { Wallet: -amountToGive },
    });

    return message.channel.send(
      `Successfully given ${member.user.tag} **$${nf.format(
        amountToGive
      )}** and deducted it from your Wallet!`
    );
  }
};
export const name: string = "pay";
export const category: string = "Economy";
export const description: string =
  "Give someone else some money from your Wallet.";
export const usage: string = "!pay @user <Amount>.";
export const aliases: string[] = ["give", "givemoney"];
export const cooldown: number = 15000;

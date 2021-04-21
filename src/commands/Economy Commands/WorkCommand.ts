import EconomySchema from "../../../models/economy";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const Jobs: string[] = [
    "Programmer",
    "Uber",
    "Rocket Scientist",
    "Vade Developer",
    "Lead Vade Developer",
  ];
  const Job: string = Jobs[Math.floor(Math.random() * Jobs.length)];
  const Coins: number = Math.floor(Math.random() * 200);
  await EconomySchema.updateOne({
    User: message.author.id,
    $inc: { Wallet: Coins },
  });
  return message.channel.send(
    `You earnt **${Coins}** by working as a **${Job}**!`
  );
};

export const name: string = "work";
export const category: string = "economy";
export const cooldown: number = 30000;
export const premiumOnly: boolean = true;

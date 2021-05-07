import EconomySchema from "../../../models/economy";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const Jobs = {
    "Rocket Scientist": 10000,
    Programmer: 12000,
    Scientist: 5000,
    Cleaner: 2000,
    Beggar: 1000,
    "Discord Moderator": 7500,
    "Discord Bug Hunter": 5000,
    Model: 4500,
    Gamer: 2000,
  };
  const locateSchema = await EconomySchema.findOne({ User: message.author.id });
  if (!locateSchema || !locateSchema.Job)
    return message.channel.send(
      `You currently do not have a job. You can select a job by doing \`!job\`.`
    );
  if (locateSchema.Worked)
    return message.channel.send(
      `You have already worked your hours this week!`
    );

  await locateSchema.updateOne({
    Worked: true,
  });

  return message.channel.send(
    `You successfully worked your hours for this week!`
  );
};

export const name: string = "work";
export const category: string = "Economy";
export const cooldown: number = 30000;
export const premiumOnly: boolean = true;
export const description: string = "Work and earn yourself some Coins!";

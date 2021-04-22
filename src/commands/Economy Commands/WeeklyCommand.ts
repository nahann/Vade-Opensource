import { RunFunction } from "../../interfaces/Command";
import ms from "ms";
import EconomySchema from "../../../models/economy";

export const run: RunFunction = async (client, message) => {
  const Profile = await EconomySchema.findOne({ User: message.author.id });
  if (
    !Profile ||
    !(Profile as any)?.WeeklyTime ||
    Date.now() > (Profile as any).WeeklyTime
  ) {
    if (Profile)
      await EconomySchema.findOneAndUpdate({
        User: message.author.id,
        $inc: { Wallet: 25000 },
      });
    if (Profile)
      await EconomySchema.updateOne({
        User: message.author.id,
        WeeklyTime: Date.now() + ms("7d"),
      });

    if (!Profile) {
      const newSchema = new EconomySchema({
        User: message.author.id,
        Wallet: 25000,
        Bank: 0,
        WeeklyTime: Date.now() + ms("7d"),
      });

      await newSchema.save();
    }
    return message.channel.send(
      new client.embed()
        .setTitle(`Success`)
        .setDescription(`I have given you your 25,000 Weekly Coins!`)
        .setMainColor()
    );
  } else
    return message.channel.send(
      new client.embed()
        .setDescription(
          `You can use this Command again in ${ms(
            (Profile as any).WeeklyTime - Date.now(),
            { long: true }
          )}`
        )
        .setMainColor()
    );
};

export const name: string = "weekly";
export const category: string = "Economy";

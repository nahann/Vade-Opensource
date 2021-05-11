import { RunFunction } from "../../interfaces/Command";
import ms from "ms";
import EconomySchema from "../../models/economy";

export const run: RunFunction = async (client, message) => {
  const Profile = await EconomySchema.findOne({ User: message.author.id });
  if (
    !Profile ||
    !(Profile as any)?.MonthlyTime ||
    Date.now() > (Profile as any).MonthlyTime
  ) {
    if (Profile)
      await EconomySchema.findOneAndUpdate({
        User: message.author.id,
        $inc: { Wallet: 100000 },
        MonthlyTime: Date.now() + ms("30d"),
      });

    if (!Profile) {
      const newSchema = new EconomySchema({
        User: message.author.id,
        Wallet: 100000,
        Bank: 0,
        MonthlyTime: Date.now() + ms("30d"),
      });

      await newSchema.save();
      return message.channel.send(
        new client.embed()
          .setTitle("Success!")
          .setDescription(`I have given you your 100,000 monthly Coins!`)
          .setMainColor()
      );
    }
  } else
    return message.channel.send(
      new client.embed()
        .setDescription(
          `You can use this Command again in ${ms(
            (Profile as any).MonthlyTime - Date.now(),
            { long: true }
          )}`
        )
        .setMainColor()
    );
};

export const name: string = "monthly";
export const category: string = "Economy";
export const description: string = "Collect your Monthly coins!";

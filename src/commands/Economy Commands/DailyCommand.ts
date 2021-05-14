import { RunFunction } from "../../interfaces/Command";
import ms from "ms";
import EconomySchema from "../../models/economy";

export const run: RunFunction = async (client, message) => {
  const Profile = await EconomySchema.findOne({ User: message.author.id });
  if (
    !Profile ||
    !(Profile as any)?.DailyTime ||
    Date.now() > (Profile as any).DailyTime
  ) {
    if (Profile)
      await EconomySchema.findOneAndUpdate({
        User: message.author.id,
        $inc: { Wallet: 2500 },
      });
    if (Profile)
      await EconomySchema.updateOne({
        User: message.author.id,
        DailyTime: Date.now() + ms("1d"),
      });

    if (!Profile) {
      const newSchema = new EconomySchema({
        User: message.author.id,
        Wallet: 2500,
        Bank: 0,
        DailyTime: Date.now() + ms("1d"),
      });

      await newSchema.save();
    }
    return message.channel.send(
      new client.embed()
        .setTitle("Success!")
        .setDescription(`I have given you your 2,500 Daily Coins!`)
        .setMainColor()
    );
  } else
    return message.channel.send(
      new client.embed().setDescription(
        `You can use this Command again in ${ms(
          (Profile as any).DailyTime - Date.now(),
          { long: true }
        )}`
      )
    );
};

export const name: string = "daily";
export const category: string = "Economy";
export const description: string = "Collect your Daily coins!";
export const usage: string = "!daily";

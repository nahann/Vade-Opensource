import { RunFunction } from "../../interfaces/Command";
import ms from "ms";
import EconomySchema from "../../../models/economy";

export const run: RunFunction = async (client, message) => {
  const Profile = await EconomySchema.findOne({ User: message.author.id });
  if (
    !Profile ||
    !(Profile as any)?.HourlyTime ||
    Date.now() > (Profile as any).HourlyTime
  ) {
    if (Profile)
      await EconomySchema.findOneAndUpdate({
        User: message.author.id,
        $inc: { Wallet: 1000 },
      });
    if (Profile)
      await EconomySchema.updateOne({
        User: message.author.id,
        HourlyTime: Date.now() + ms("1h"),
      });

    if (!Profile) {
      const newSchema = new EconomySchema({
        User: message.author.id,
        Wallet: 1000,
        Bank: 0,
        HourlyTime: Date.now() + ms("1h"),
      });

      await newSchema.save();
    }
    return message.channel.send(
      new client.embed()
        .setTitle("Success!")
        .setDescription(`I have given you your 1,000 Hourly Coins!`)
        .setMainColor()
    );
  } else
    return message.channel.send(
      new client.embed()
        .setDescription(
          `You can use this Command again in ${ms(
            (Profile as any).HourlyTime - Date.now(),
            { long: true }
          )}`
        )
        .setMainColor()
    );
};

export const name: string = "hourly";
export const category: string = "Economy";
export const usage: string = "!hourly";
export const description: string = "Collect your Hourly coins!";
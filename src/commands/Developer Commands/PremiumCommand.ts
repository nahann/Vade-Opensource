import { RunFunction } from "../../interfaces/Command";
import PremiumSchema from "../../../src/models/premium_schema";
import { GuildMember } from "discord.js-light";
import mongoose from "mongoose";

export const run: RunFunction = async (client, message, args) => {
  const user: GuildMember = await client.utils.getMember(
    message,
    args[1],
    true
  );
  if (!user) return;
  const schema_check = await PremiumSchema.findOne({ User: user.id });

  switch (args[0]) {
    case "add":
      if (schema_check)
        return message.channel.send(`That user already has Premium.`);

      const newSchema = new PremiumSchema({
        _id: mongoose.Types.ObjectId(),
        User: user.id,
      });

      await newSchema.save();

      message.channel.send(`Successfully added Premium to ${user?.user.tag}`);

      break;

    case "check":
      if (schema_check) return message.channel.send(`That user has Premium.`);

      break;

    case "remove":
      if (!schema_check)
        return message.channel.send(`That user doesn't have Premium.`);
      await schema_check.delete();
      message.channel.send(`Successfully removed that users Premium.`);

      break;

    default:
      return message.channel.send(
        `Please specify either add, remove or check.`
      );
  }
};

export const name: string = "premium";
export const category: string = "Development";
export const devOnly: boolean = true;

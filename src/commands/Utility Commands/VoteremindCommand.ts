import { RunFunction } from "../../interfaces/Command";
import main_schema from "../../models/voteremind";

export const run: RunFunction = async (client, message, args) => {
  const locate_schema = await main_schema.findOne({ User: message.author.id });
  if (!locate_schema)
    return message.channel.send(
      `You need to have voted for the Bot on top.gg to use this Command. You can vote via https://top.gg/bot/782309258620305438`
    );

  switch (args[0]?.toLowerCase()) {
    case "enable": {
      if (locate_schema.Enabled)
        return message.channel.send(`This is already enabled.`);

      await locate_schema.updateOne({
        Enabled: true,
      });

      return message.channel.send(
        `You will now be reminded when you can next vote.`
      );
    }

    case "disable": {
      if (!locate_schema.Enabled)
        return message.channel.send(`This is already disabled.`);

      await locate_schema.updateOne({
        Enabled: false,
      });

      return message.channel.send(`Successfully disabled vote reminders.`);
    }
  }
};

export const name: string = "voteremind";
export const category: string = "Utility";
export const description: string = "Enable/disable the vote reminding.";
export const aliases: string[] = ["votereminder"];

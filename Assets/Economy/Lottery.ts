import { Bot } from "client/Client";
import schedule from "node-schedule";
import lotterySchema from "../../models/lottery";
import { TextChannel } from "discord.js";

export default main;

// make this async fuck it
async function main(client: Bot) {
  schedule.scheduleJob({ hour: 12, minute: 0 }, async () => {
    const lotteryChannel = client.channels.cache.get(
      "833920140730171412"
    ) as TextChannel;
    const lottery = await lotterySchema.findOne();
    if (!lottery) {
      lotteryChannel.send("No one entered the lottery");
      console.log("No one entered into the lottery");
    } else {
      const nf = Intl.NumberFormat();
      const entrants = lottery.entries;
      const winner = entrants[Math.floor(Math.random() * entrants.length)];
      console.log(`Rolling lottery...`);
      await client.utils.addBal(winner, lottery.pot);
      lotteryChannel.send(
        `Congrats <@${winner}> on winning the lottery with a pot of ${nf.format(
          lottery.pot
        )} coins`
      );
      await lotterySchema.findOneAndDelete();
    }
  });
}

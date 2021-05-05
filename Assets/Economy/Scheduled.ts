import { Bot } from "client/Client";
import schedule from "node-schedule";
import lotterySchema from "../../models/lottery";
import { TextChannel } from "discord.js-light";
import economy from '../../models/economy';
import ms from 'ms';

export default main;

async function main(client: Bot) {
  schedule.scheduleJob({ hour: 12, minute: 0 }, async () => { // Lottery
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

  schedule.scheduleJob({ hour: 20, minute: 45 }, async () => {
    const locate_schema = await economy.find({ });
    const nf = Intl.NumberFormat();
    for(const schema of locate_schema) {
      if(schema.Job && schema.Wage) {
        let wage = schema.Wage;
        if(schema.Worked) {
          let ID = schema.User;
          let user = client.users.fetch(ID);
          if(user) {
            if(!schema.LastPaid || schema.LastPaid < Date.now()) {
              await schema.updateOne({ 
                LastPaid: Date.now() + ms('7d'),
                Worked: false,
                $inc: { Wallet: wage }
              });
              (await user).send(`Your weekly salary of $${nf.format(schema.Wage)} has been deposited into your Bank! Make sure you deposit it!`).catch((e) => [
                console.log(`Unable to DM the user with the ID of ${ID} to notify them of their weekly salary.`)
              ]);
            }
          }
        }

      }
    }
  })

}

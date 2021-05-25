import { Bot } from "../client/Client";
import DBL from "dblapi.js";
import { TextChannel } from "discord.js-light";
import ms from "ms";
import p from "phin";

import vote_schema from "../models/voteremind";

export default (client: Bot) => {
  // Only the main Bot, can't test these on the test bot
  if (client.user.id === "782309258620305438") {
    const dbl = new DBL(client.config.TOPGG_TOKEN, {
      webhookPort: 5042,
      webhookAuth: client.config.TOPGG_AUTH,
    });

    dbl.webhook.on("ready", (hook) => {
      client.logger.info(
        `Top.gg webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
      );
    });

    const dblPOST = new DBL(client.config.TOPGG_TOKEN, client);

    dblPOST.on("posted", () => {
      client.logger.info(`Server count posted to top.gg!`);
    });

    // SENDING THE VOTE REMINDER IF ENABLED
    client.setInterval(async () => {
      /* bot stats */
      // const guilds = client.shard.fetchClientValues("")

      await p({
        url: `https://top.gg/api/bots/${client.user.id}/stats`,
        method: "post",
        data: JSON.stringify({
          server_count: client.guilds.cache.size,
        }),
        headers: {
          Authorization: client.config.TOPGG_AUTH,
        },
      });

      /* vote reminders */
      const getAll = await vote_schema.find({});

      getAll.forEach(async (schema) => {
        if (schema.Enabled && !schema.Messaged) {
          const person = client.users.cache.get(schema.User);

          if (schema.Time < Date.now())
            await person.send(
              `You can vote again on Top.gg! Vote here: https://top.gg/bot/782309258620305438 Reminder: You can disable reminders via \`!votereminder disable\`.`
            );

          await schema.updateOne({
            Messaged: true,
          });
        }
      });
    }, ms("15m"));
  }

  



  // both bots
};

export async function remindToVote(bot: Bot, userId: string) {
  const dateCanVote = Date.now() + ms("12h");

  const voteLogs = bot.guilds.cache
    .get(bot.config.MAIN_GUILD)
    .channels.cache.get("795711027567263846") as TextChannel;

  bot.logger.info(`User with ID ${userId} just voted on top.gg!`);
  voteLogs.send(
    `<@${userId}> just voted for the Bot on top.gg! (ID: **${userId}**)`
  );

  const voteSchema = await vote_schema.findOne({ User: userId });
  if (!voteSchema) {
    const newVoteSchema = new vote_schema({
      User: userId,
      Time: dateCanVote,
      Enabled: true,
      Messaged: false,
    });

    await newVoteSchema.save();
    const user = bot.users.cache.get(userId);
    return user.send(
      `Thanks for voting for the Bot on top.gg! You will be reminded in 12 hours when you can vote again! To disable reminders simply run the Command \`!voteremind disable\`.`
    );
  } else {
    await voteSchema.updateOne({
      Time: dateCanVote,
      Messaged: false,
    });
  }
}

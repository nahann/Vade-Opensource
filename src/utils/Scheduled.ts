import schedule from "node-schedule";
import lotterySchema from "../models/lottery";
import { TextChannel } from "discord.js-light";
import ms from "ms";
import { promisify } from "util";
import { Console } from "console";
const wait = promisify(setTimeout);

import economy from "../models/economy";
import scheduleRoles from "../models/GuildConfig/scheduleRoles";
import { Bot } from "../client/Client";

export default main;

async function main(client: Bot) {
  schedule.scheduleJob({ hour: 12, minute: 0 }, async () => {
    // Lottery
    const lotteryChannel = client.channels.cache.get(
      "833920140730171412"
    ) as TextChannel;

    const lottery = await lotterySchema.findOne();
    if (!lottery) {
      console.log(`No entry participants`);
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
    const locate_schema = await economy.find({});
    const nf = Intl.NumberFormat();
    for (const schema of locate_schema) {
      if (schema.Job && schema.Wage) {
        let wage = schema.Wage;
        if (schema.Worked) {
          let ID = schema.User;
          let user = client.users.fetch(ID);
          if (user) {
            if (!schema.LastPaid || schema.LastPaid < Date.now()) {
              await schema.updateOne({
                LastPaid: Date.now() + ms("7d"),
                Worked: false,
                $inc: { Wallet: wage },
              });
              (await user)
                .send(
                  `Your weekly salary of $${nf.format(
                    schema.Wage
                  )} has been deposited into your Bank! Make sure you deposit it!`
                )
                .catch((e) => [
                  console.log(
                    `Unable to DM the user with the ID of ${ID} to notify them of their weekly salary.`
                  ),
                ]);
            }
          }
        }
      }
    }
  });

  schedule.scheduleJob({ day: 1, hour: 7, minute: 0 }, async () => {
    // day: 1, hour: 7, minute: 0
    // Remove the roles

    const all = await scheduleRoles.find({}); // Find all guilds with it active.
    if (!all) return; // No guilds with it active.

    for (const one of all) {
      const guild = await client.guilds.fetch(one.guildID);
      if (!guild) return; // Can't locate the server.
      const roles = one.roleArray;
      if (roles.length < 1) return; // If there aren't any or at least 1, return
      for (const role of roles) {
        const fetchRole = await guild.roles.fetch(role); // Get the role from the guilds roles, return if it isn't there.
        if (!fetchRole) return;
        if (!guild.me.permissions.has("MANAGE_ROLES")) return; // smh
        const members = await guild.members.fetch();
        const roleMembers = members.filter((m) => m.roles.cache.has(role));
        if (roleMembers.size < 1) return; // If there isn't at least one person in the role, return
        roleMembers.forEach(async (member) => {
          await member.roles.remove(role);
          await wait(2000); // Wait two seconds between each user (ratelimits).
        });
      }
    }
  });

  schedule.scheduleJob({ day: 5, hour: 18, minute: 0 }, async () => {
    // day: 5, hour: 18, minute: 0
    const all = await scheduleRoles.find({}); // Find all guilds with it active.
    if (!all) return; // No guilds with it active.
    for (const one of all) {
      const guild = await client.guilds.fetch(one.guildID);
      if (!guild) return; // Can't locate the server.
      const roles = one.roleArray;
      if (roles.length < 1) return; // If there aren't any or at least 1, return
      for (const role of roles) {
        const fetchRole = await guild.roles.fetch(role); // Get the role from the guilds roles, return if it isn't there.
        if (!fetchRole) return;
        if (!guild.me.permissions.has("MANAGE_ROLES")) return; // smh
        const members = await guild.members.fetch();
        members.forEach(async (member) => {
          await member.roles.add(role);
          await wait(2000); // Wait two seconds between each user (ratelimits).
        });
      }
    }
  });
}

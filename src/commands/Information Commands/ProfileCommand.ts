import { RunFunction } from "../../interfaces/Command";
import MainUser from "../../models/profile";
import { Util } from "discord.js";
import ms from "ms";

export const run: RunFunction = async (client, message, args) => {
  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;

  let locate_schema = await MainUser.findOne({ User: member.id });
  let Wallet = locate_schema?.Wallet ?? 0;
  let Bank = locate_schema?.Bank ?? 0;
  let Partner = locate_schema?.Partner
    ? (await client.users.fetch(locate_schema.Partner)).tag
    : "No Partner";
  let Job = locate_schema?.Job ? locate_schema.Job : "Unemployed";
  let Wage = locate_schema?.Wage ? locate_schema.Wage : 0;
  let HourlyTime =
    !locate_schema ||
    !locate_schema.HourlyTime ||
    Date.now() > (locate_schema as any)?.HourlyTime
      ? "Ready to claim!"
      : ms(locate_schema?.HourlyTime - Date.now(), { long: true });
  let DailyTime =
    !locate_schema ||
    !locate_schema.DailyTime ||
    Date.now() > (locate_schema as any)?.DailyTime
      ? "Ready to claim!"
      : ms(locate_schema?.DailyTime - Date.now(), { long: true });
  let WeeklyTime =
    !locate_schema ||
    !locate_schema.WeeklyTime ||
    Date.now() > (locate_schema as any)?.WeeklyTime
      ? "Ready to claim!"
      : ms(locate_schema?.WeeklyTime - Date.now(), { long: true });
  let MonthlyTime =
    !locate_schema ||
    !locate_schema.MonthlyTime ||
    Date.now() > (locate_schema as any)?.MonthlyTime
      ? "Ready to claim!"
      : ms(locate_schema?.MonthlyTime - Date.now(), { long: true });

  let nf = Intl.NumberFormat();

  let MainEmbed = new client.embed()
    .setTitle(`${Util.escapeMarkdown(member.user.tag)}'s Profile`)
    .addField(
      "Economy",
      `Wallet: ${nf.format(Wallet)}\nBank: ${nf.format(
        Bank
      )}\nEmployment Status: ${Job}\nWeekly Wage: ${nf.format(Wage)}`
    )
    .addField("Personal", `Partner: ${Util.escapeMarkdown(Partner)}`)
    .addField(
      "Cooldowns",
      `Hourly: ${HourlyTime}\nDaily: ${DailyTime}\nWeekly: ${WeeklyTime}\nMonthly: ${MonthlyTime}`
    )
    .setMainColor()
    .setTimestamp()
    .setFooter(
      `Requested by ${message.author.tag}`,
      message.author.displayAvatarURL()
    );

  message.channel.send(MainEmbed);
};
export const name: string = "profile";
export const category: string = "Information";
export const description: string = "View the profile of a specified user.";
export const aliases: string[] = ["prof"];

import { GuildMember } from "discord.js";
import { RunFunction } from "../../interfaces/Command";
import EconomySchema from "../../models/profile";

export const run: RunFunction = async (client, message, args) => {
  let user: GuildMember = message.member;
  const nf = Intl.NumberFormat();
  if (message.mentions.members.first()) user = message.mentions.members.first();
  if (args[9] && message.guild.members.cache.has(args[0]))
    user = message.guild.members.cache.get(args[0]);
  const Profile = await EconomySchema.findOne({ User: user.id });
  return message.channel.send(
    new client.embed()
      .setTitle(`${user.user.tag}'s Balance`)
      .setDescription(
        `Wallet: ${nf.format((Profile as any)?.Wallet) ?? 0}\nBank: ${
          nf.format((Profile as any)?.Bank) ?? 0
        }`
      )
      .setMainColor()
  );
};

export const name: string = "balance";
export const category: string = "Economy";
export const aliases: string[] = ["bal"];
export const description: string =
  "View either your own or another users balance.";

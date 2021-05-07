import { RunFunction } from "../../interfaces/Command";
import mainSchema from "../../../models/economy";

export const run: RunFunction = async (client, message, args) => {
  if (message.channel.type !== "text") return;

  const nf = Intl.NumberFormat();

  const user = await client.utils.getMember(message, args[0]);
  if (!user || user.id === message.author.id || user.id === client.user.id)
    return client.utils.sendError(
      `You need to specify who you wish to rob!`,
      message.channel
    );
  const Res = await mainSchema.findOne({ User: user.id });
  const isPassive = Res?.Passive;

  if (isPassive)
    return client.utils.sendError(
      `That user is in passive mode!`,
      message.channel
    );
  const authorRes = await mainSchema.findOne({ User: message.author.id });
  if (authorRes && authorRes.Passive)
    return client.utils.sendError(
      `You cannot rob someone whilst in passive mode!`,
      message.channel
    );
  const userBal = authorRes.Wallet ?? 0;
  if (userBal < 2000)
    return client.utils.sendError(
      `You need at least $2,000 Coins to rob someone!`,
      message.channel
    );
  const robberBal = Res.Wallet ?? 0;
  if (robberBal <= 0 || robberBal < 2000)
    return client.utils.sendError(
      `You cannot rob someone with less than $2,000 in their Wallet!`,
      message.channel
    );
  const checkPremium = await client.utils.checkPremium(message.author.id);
  const successRate = checkPremium
    ? Math.floor(Math.random() * 100)
    : Math.floor(Math.random() * 80) * 1.35;

  const func =
    successRate > 60
      ? async () => {
          const available = robberBal / 3;
          const stealAmount = Math.floor(
            Math.random() * (available - 2000) + 2000
          );
          await Res.updateOne({
            $inc: { Wallet: -stealAmount },
          });
          await authorRes.updateOne({
            $inc: { Wallet: stealAmount },
          });
          return `Rob successful! You stole a grand total of **$${nf.format(
            stealAmount
          )}**`;
        }
      : async () => {
          const available = robberBal / 3;
          const fine = Math.floor(Math.random() * (available - 2000) + 2000);
          await authorRes.updateOne({
            $inc: { Wallet: -fine },
          });
          return `Rob failed! You were caught by the police and fined **$${nf.format(
            fine
          )}**`;
        };

  let embed = new client.embed()
    .setDescription(await func())
    .setAuthor(
      `${message.member.displayName}#${message.author.discriminator}`,
      message.author.displayAvatarURL({ dynamic: true })
    )
    .setMainColor()
    .setFooter("Vade Economy System")
    .setTimestamp();

  return message.channel.send(embed);
};
export const name: string = "rob";
export const category: string = "Economy";
export const description: string = "Rob another users Wallet!";
export const aliases: string[] = ["steal"];

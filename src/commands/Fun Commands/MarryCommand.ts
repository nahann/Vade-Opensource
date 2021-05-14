import { RunFunction } from "../../interfaces/Command";
import mainUser from "../../models/profile";

export const run: RunFunction = async (client, message, args) => {
  const schemaLocate = await mainUser.findOne({ User: message.author.id });
  if (!schemaLocate)
    return client.utils.sendError(
      `You think you're rich enough to marry someone? Get a job and try again when you're financially stable.`,
      message.channel
    );

  const married = schemaLocate ? schemaLocate.Partner : null;
  if (married)
    return client.utils.sendError(
      `You are already married to ${
        (await client.users.fetch(schemaLocate.Partner))?.tag
      }`,
      message.channel
    );

  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;

  const checkPartner = await mainUser.findOne({ Partner: member.id });
  if (checkPartner)
    return client.utils.sendError(
      `They are already in a "happy" marriage!`,
      message.channel
    );
  message.channel.send(
    `${member}, do you accept ${message.member} as your Partner in life?`
  );
  const verify = await client.utils.verify(message.channel, member, {
    time: 30000,
    extraYes: ["i do"],
  });
  const partnerSchema = await mainUser.findOne({ User: member.id });

  if (!verify)
    return client.utils.sendError(
      `${message.member}, You clearly aren't rich enough yet to attract a woman. Buy a car and try again!`,
      message.channel
    );

  await schemaLocate.updateOne({
    Partner: member.id,
  });

  if (!partnerSchema) {
    const newSchema = new mainUser({
      User: member.id,
      Partner: message.author.id,
      Wallet: 0,
      Bank: 0,
    });

    await newSchema.save();

    return client.utils.succEmbed(
      `You're now married to ${message.member}!`,
      message.channel
    );
  }

  await partnerSchema.updateOne({
    Partner: message.author.id,
  });

  return client.utils.succEmbed(
    `You're now married to ${message.member}!`,
    message.channel
  );
};
export const name: string = "marry";
export const category: string = "Fun";
export const description: string = "Marry someone!";
export const aliases: string[] = ["marriage"];

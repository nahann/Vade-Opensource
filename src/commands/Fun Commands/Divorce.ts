import { RunFunction } from "../../interfaces/Command";
import mainUser from "../../models/profile";

export const run: RunFunction = async (client, message, args) => {
  const locateUser = await mainUser.findOne({ User: message.author.id });
  if (!locateUser || !locateUser.Partner)
    return client.utils.sendError(
      `You aren't married to anyone!`,
      message.channel
    );
  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;
  if (locateUser.Partner !== member.id)
    return client.utils.sendError(
      `You aren't even married to ${member.user.tag}... dream on.`,
      message.channel
    );
  message.reply(
    `Are you sure you would like to divorce ${
      (await client.users.fetch(locateUser.Partner))?.tag
    }?`
  );
  const verify = await client.utils.verify(message.channel, message.member, {
    time: 30000,
  });
  if (!verify)
    return client.utils.sendError(
      `Looks as if you changed your mind then...`,
      message.channel
    );
  const partnerSchema = await mainUser.findOne({ Partner: message.author.id });

  await locateUser.updateOne({
    Partner: null,
  });

  await partnerSchema.updateOne({
    Partner: null,
  });

  return client.utils.succEmbed(
    `You are now free from ${
      (await client.users.fetch(locateUser.Partner))?.tag
    }, congratulations!`,
    message.channel
  );
};
export const name: string = "divorce";
export const category: string = "Fun";
export const description: string = "Divorce your Parnter in life.";
export const aliases: string[] = ["breakup"];

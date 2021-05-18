import { RunFunction } from "../../interfaces/Command";
import profile from "../../models/profile";

export const run: RunFunction = async (client, message, args, lang) => {
  if (!args[0] || !client.config.supportedLang.includes(args[0]?.toLowerCase()))
    return client.utils.sendError(
      `${client.translate({
        locale: lang,
        phrase: "language.invalid",
      })}: \n\n${client.config.supportedLang.join("\n")}`,
      message.channel
    );

  const check = await profile.findOne({ User: message.author.id });
  if (check) {
    await check.updateOne({
      Language: args[0]?.toLowerCase(),
    });

    return client.utils.succEmbed(
      `${client.translate({
        locale: lang,
        phrase: "language.success",
      })}: ${args[0]?.toLowerCase()}`,
      message.channel
    );
  } else {
    const newProf = new profile({
      User: message.author.id,
      Wallet: 0,
      Bank: 0,
      Language: args[0]?.toLowerCase(),
    });

    await newProf.save();

    return client.utils.succEmbed(
      `${client.translate({
        locale: lang,
        phrase: "language.success",
      })}: ${args[0]?.toLowerCase()}`,
      message.channel
    );
  }
};
export const name: string = "language";
export const category: string = "Utility";
export const description: string = "";
export const aliases: string[] = ["setlang"];

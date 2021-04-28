import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const polls = args.join(" ");

  const regex = polls.match(/"[^"]+"|[\\S]+"[^"]+/g);
  const title = polls.match(/([^"]+)"/s)?.[0].trim();
  if (!regex)
    return message.reply(
      'Please enter your options in quotation marks. Example: !poll "option 1" "option 2" "option 3".'
    );
  if (regex.length > 10) {
    return message.reply("You can only have 10 poll options");
  }
  let str = "";
  const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
  let col = 0;
  for (const poll of regex) {
    str = `${str}${emojis[col]} ${poll}\n\n`;
    col++;
  }
  const embed = new client.embed()
    .setTitle(title?.replace(/"/g, "") || "No Question")
    .setDescription(str.replace(/"/g, ""))
    .setClear();

  const msg = await message.channel.send(embed);
  for (let i = 0; i < regex.length; i++) {
    msg.react(emojis[i]);
  }
  return null;
};
export const name: string = "poll";
export const category: string = "Utility";
export const description: string = "Create a poll!";

import { MessageEmbed, Message } from "discord.js-light";
import { MessageButton } from "../utils/buttons/src";

import type MsgBtn from "../utils/Buttons/typings/Classes/MessageButton";

const paginationEmbed = async (
  msg: Message,
  pages: MessageEmbed[],
  emojiList = ["⏪", "⏩"],
  timeout = 60000
) => {
  if (!msg && !msg.channel) {
    throw new Error("Channel is inaccessible to the client.");
  }

  if (!pages) {
    throw new Error("Pages are not given.");
  }

  if (emojiList.length !== 2) {
    throw new Error("Needs two emojis.");
  }

  let page = 0;
  const curPage = await msg.channel.send(
    pages[page]?.setFooter(`Page ${page + 1} / ${pages.length}`) ??
      "No role members to display. This is usually due to Discords caching limitations."
  );

  const backButton: MsgBtn = new MessageButton()
    .setStyle("gray")
    .setID("back")
    .setLabel("Previous")

  for (const emoji of emojiList) await curPage.react(emoji);
  const reactionCollector = curPage.createReactionCollector(
    (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
    { time: timeout }
  );

  reactionCollector.on("collect", (reaction) => {
    reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    curPage.edit(
      pages[page]?.setFooter(`Page ${page + 1} / ${pages.length}`)
    ) ?? "";
  });
  reactionCollector.on("end", () => {
    if (!curPage.deleted) {
      curPage.reactions.removeAll();
    }
  });
  return curPage;
};
export default paginationEmbed;

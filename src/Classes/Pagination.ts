import { MessageButton, ButtonStyle } from "../utils/buttons/src/Classes/MessageButton";

import type { MessageEmbed, Message } from "discord.js-light";
import type ButtonEvent from "../utils/buttons/src/Classes/INTERACTION_CREATE";

const paginationEmbed = async (
  msg: Message,
  pages: MessageEmbed[],
  emojiList = ["⏪", "⏩"],
  _timeout = 60000
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

  const forwardButton = new MessageButton()
    .setStyle(ButtonStyle.Secondary)
    .setID("forward")
    .setLabel("Forward")
    .setEmoji(emojiList[1])

  const exitButton = new MessageButton()
    .setStyle(ButtonStyle.Secondary)
    .setID("exit")
    .setLabel("Exit")
    .setEmoji("❌")

  const backButton = new MessageButton()
    .setStyle(ButtonStyle.Secondary)
    .setID("back")
    .setLabel("Back")
    .setEmoji(emojiList[0])

  const collector = curPage.createButtonCollector((button) => button.data.member.user.id === msg.author.id, { time: 60e3 });
  collector.on('collect', (b: ButtonEvent) => {
    b.defer(true)

    switch (b.id) {
      case "forward": {
        page = page + 1 < pages.length ? ++page : 0;
        break
      }
       
      case "exit": {
        return collector.stop("exited")
      }
       
      case "back": {
        page = page > 0 ? --page : pages.length - 1;
        break
      }
    }

    curPage.edit({
      embed: pages[page]?.setFooter(`Page ${page + 1} / ${pages.length}`),
      buttons: [ backButton, exitButton, forwardButton ]
    });
  });

  collector.on('end', () => {
    forwardButton.setDisabled()
    backButton.setDisabled()
    curPage.edit({ embed: pages[0], buttons: [ backButton, forwardButton ] })
  })
  
  curPage.edit({ buttons: [ backButton, exitButton, forwardButton ] })
  return curPage;
};

export default paginationEmbed;
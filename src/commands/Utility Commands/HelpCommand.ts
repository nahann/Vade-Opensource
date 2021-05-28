import type { RunFunction } from "../../interfaces/Command";
import constants from "../../interfaces/Constants";
import FuzzySearch from "fuse.js";
import { Paginate } from "@the-nerd-cave/paginate";
import paginationEmbed from "../../Classes/Pagination";
import { MessageButton, ButtonStyle } from "../../utils/buttons/src/Classes/MessageButton";

export const run: RunFunction = async (client, message, args) => {
  const checkOrCross = (bool) =>
    bool ? constants.emojis.check : constants.emojis.x;

  const prefix = await client.utils.resolvePrefix(message.guild.id);
  const totalCommands = client.commands.size;
  const allCategories = [
    ...new Set(client.commands.map((cmd) => cmd.category)),
  ];

  const availableCategories = await Promise.all(
    allCategories.map((cat) => client.utils.categoryCheck(cat, message))
  );

  const categories = allCategories.filter((_, idx) => availableCategories[idx]);

  let button = new MessageButton()
    .setStyle(ButtonStyle.Link)
    .setLabel(`Support Server`)
    .setURL(`https://vade-bot.com/discord`)

  if (!args.length) {
    const mainEmbed = new client.embed()
      .setDescription([
        `Available Categories for: **${message.guild.name}**`,
        `Prefix: ** ${prefix} **`,
        `Total Commands: **${totalCommands}**`,
        `\u200B`,
        `[Support Server](https://discord.gg/FwBUBzBkYt)`,
      ])
      .setClear();

    for (const category of categories) {
      mainEmbed.addField(
        `**${client.utils.capitalise(category)} [${
          client.commands.filter((cmd) => cmd.category === category).size
        }]**`,
        `${prefix}help ${client.utils.capitalise(category)}`,
        true
      );
    }
    // @ts-ignore
    return message.channel.send({ embed: mainEmbed, buttons: [ button ]});
  }

  const input = args.join(" ");

  const allCommands = client.commands
    .map((cmd) => [cmd.name, ...(cmd.aliases || [])])
    .flat();

  // = Array of all Command names and Categories
  const result = new FuzzySearch(allCategories.concat(allCommands), {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    includeMatches: true,
    findAllMatches: false,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.6,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    ignoreFieldNorm: false,
  }).search(input);

  const [match] = result;

  const noMatchEmbed = new client.embed()
    .setDescription(
      `No match found for that input. Please try an input closer to one of the command/category names.`
    )
    .setErrorColor();

  if (!match) {
    return noMatchEmbed;
  }

  const { item } = match;

  if (allCategories.includes(item)) {
    // what are we doing lol

    const commandsToPaginate = client.commands
      .filter((cmd) => cmd.category === item)
      .map(
        (command) =>
          `**${client.utils.capitalise(command.name)}**\n${
            command.description
          }\n`
      );

    const pages = new Paginate(commandsToPaginate, 8).getPaginatedArray();

    const embeds = pages.map((page, index) => {
      return new client.embed()
        .setTitle(`${client.utils.capitalise(item)}'s Help Menu`)
        .setDescription(
          page || `No more Commands to be listed on page ${index + 1}`
        )
        .setClear()
        .setTimestamp();
    });

    let emojiList = ["◀️", "▶️"];
    return await paginationEmbed(message, embeds, emojiList, 60 * 1000);
    // works
  }

  const command =
    client.commands.get(item) ??
    client.commands.find(({ aliases }) => aliases.includes(item));

  if (!command) {
    const noMatchEmbed2 = new client.embed()
      .setDescription(
        `No match found for that input. Please try an input closer to one of the command/category names.`
      )
      .setErrorColor();
    // @ts-ignore
    return await message.channel.send({ embed: noMatchEmbed2, buttons: [ button ] });
  }

  const commandEmbed = new client.embed()
    .setClear()
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter(`Requested by ${message.author.tag}`)
    .setDescription([
      `**❯** Aliases: **${
        // ah
        command.aliases?.length
          ? command.aliases.map((alias) => `\`${alias}\``).join(" ")
          : "No aliases."
      }**`,
      `**❯** Description: **${command.description}**`,
      `**❯** Category: **${command.category}**`,
      `**❯** Usage: **${command.usage}**`,
      `**❯** Required Permissions: **${
        command.userPerms?.length
          ? command.userPerms.map(client.utils.formatPerms).join(", ")
          : "No Permissions Needed."
      }**`,
      `**❯** Moderator Command: ${checkOrCross(command.modCommand)}`,
      `**❯** Administrator Command: ${checkOrCross(command.adminCommand)}`,
      `**❯** [**Premium Command:**](https://vade-bot.com/premium) ${checkOrCross(
        command.premiumOnly
      )}`,
    ]);

    // @ts-ignore
  return await message.channel.send({ embed: commandEmbed, buttons: [ button ] });
};

export const name: string = "help";
export const category: string = "Information";
export const cooldown: number = 5000;

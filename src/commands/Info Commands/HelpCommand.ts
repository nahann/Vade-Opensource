import { RunFunction, Command } from '../../interfaces/Command';
import constants from '../../interfaces/Constants';
import { FuzzySearch } from 'fuse-djs-v1rtuai';
import { Paginate } from '@the-nerd-cave/paginate';
import { paginationEmbed } from 'discord.js-pagination';
import { Collection } from 'discord.js';

export const run: RunFunction = async (client, message, args) => {
  const command = args.join(' ');
  const totalCommands = client.commands.size;
  const checkOrCross = (bool) => (bool ? '`✔️`' : '`❌`');

  let prefix = await client.utils.resolvePrefix(message.guild.id);

  const allCategories: Collection<string[]> = client.utils.removeDuplicates(
    client.commands.map((cmd) => cmd.category)
  );

  const embed = new client.embed()
    .setColor('#00f2ff')
    .setAuthor(
      `${message.guild.name} Help Menu`,
      message.guild.iconURL({
        dynamic: true,
      })
    )
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter(
      `Requested by ${message.author.username}`,
      message.author.displayAvatarURL({
        dynamic: true,
      })
    )
    .setTimestamp();

  if (command) {
    const cmd =
      client.commands.get(command.toLowerCase()) ||
      client.commands.get(client.aliases.get(command.toLowerCase()));

    if (!cmd) {
      const search = new FuzzySearch(allCategories, [''], {
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
      });

      let findings = search
        .run(command)
        .map((x) => x)
        .map((x) => x);

      let ThisOne: Collection<string, string> = findings ? findings[0] : null;

      if (ThisOne && allCategories.includes(ThisOne.item)) {
        // finds the category
        const commands = client.commands
          .filter((cmd) => cmd.category === ThisOne.item)
          .map(
            (command) =>
              `**${client.utils.capitalise(command.name)}**\n${
                command.description
              }\n`
          );

        if (commands) {
          const pages = new Paginate(commands, 8).getPaginatedArray();

          const embeds = pages.map((page, index) => {
            return new client.embed()
              .setTitle(`${client.utils.capitalise(ThisOne.item)}'s Help Menu`)
              .setDescription(
                page ||
                  `No more Commands to be listed on page ${
                    index === 0 ? 1 : index + 1
                  }`
              )
              .setMainColor()
              .setTimestamp();
          });

          let emojiList = ['◀️', '▶️'];
          return paginationEmbed(message, embeds, emojiList, 60 * 1000);
        }

        return message.channel.send(`Invalid Command named. \`${command}\``);
      }
    }

    try {
      embed
        .setAuthor(
          `${client.utils.capitalise(cmd.name)} Command Help`,
          client.user.displayAvatarURL()
        )
        .setDescription([
          `**❯** Aliases: **${
            cmd.aliases.length
              ? cmd.aliases.map((alias) => `\`${alias}\``).join(' ')
              : 'No Aliases.'
          }**`,
          `**❯** Description: **${cmd.description}**`,
          `**❯** Category: **${cmd.category}**`,
          `**❯** Usage: **${cmd.usage}**`,
          `**❯** Required Permissions: **${
            cmd.userPerms.length
              ? cmd.userPerms.map(client.utils.formatPerms).join(', ')
              : 'No Permissions Needed.'
          }**`,
          `**❯** Moderator Command: ${checkOrCross(cmd.modCommand)}`,
          `**❯** Administrator Command: ${checkOrCross(cmd.adminCommand)}`,
          `**❯** [**Premium Command:**](https://vade-bot.com/premium) ${checkOrCross(
            cmd.premiumOnly
          )}`,
        ]);
    } catch {
      return message.channel.send(
        new client.embed()
          .setDescription('That is not a vaild command/category!')
          .setColor(constants.colours.error)
      );
    }
    return message.channel.send(embed);
  } else {
    embed.setDescription([
      `Available Categories for: **${message.guild.name}**`,
      `Prefix: ** ${prefix} **`,
      `Total Commands: **${totalCommands}**`,
      `\u200B`,
      `[Support Server](https://discord.gg/FwBUBzBkYt)`,
    ]);

    const availableCategories = await Promise.all(
      allCategories.map((cat) => client.utils.categoryCheck(cat, message))
    );

    const categories = allCategories.filter(
      (cat, idx) => availableCategories[idx]
    );

    for (const category of categories) {
      embed.addField(
        `**${client.utils.capitalise(category)} [${
          client.commands.filter((cmd) => cmd.category === category).size
        }]**`,
        `${prefix}help ${client.utils.capitalise(category)}`,
        true
      );
    }

    return message.channel.send(embed);
  }
};

export const name: string = 'help';
export const category: string = 'info';
export const cooldown: number = 5000;

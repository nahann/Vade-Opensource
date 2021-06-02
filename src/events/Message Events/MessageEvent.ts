import type { RunFunction } from "../../interfaces/Event";
import { Message, TextChannel} from "discord.js";
import { Command } from "../../interfaces/Command";
import profile from "../../models/profile";
import ms from "ms";
import GuildConfigSchema from "../../models/GuildConfig/guild";
import module_schema from "../../models/GuildConfig/modules";
import level_role_schema from "../../models/GuildConfig/levelRoles";
import { promisify } from "util";
const wait = promisify(setTimeout);
import { automod } from '../../utils/AutomodManager';
import levels from "../../models/Users/levels";
const verified = "817905283547267122";

export const run: RunFunction = async (client, message: Message) => {
  if (message.author.bot || !message.guild) return;
  if (message.channel.type !== "text") return;
  const GuildConfig = await GuildConfigSchema.findOne({
    guildID: message.guild.id,
  });
  let mainPrefix: string = "!";
  if ((GuildConfig as any)?.prefix) {
    mainPrefix = (GuildConfig as any).prefix;
  }
  const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);

  let prefix = message.content.match(mentionRegexPrefix)
    ? message.content.match(mentionRegexPrefix)[0]
    : mainPrefix;

  const suggestionChannelID = GuildConfig?.Suggestion;
  const checkProfile = await profile.findOne({ User: message.author.id });
  if (checkProfile?.Blacklisted && !client.owners.includes(message.author.id))
    return;
  let lang = checkProfile?.Language ?? "en";

  if (suggestionChannelID && message.channel.id === suggestionChannelID) {
    const SuggestionEmbed = new client.embed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `${message.content}\n\n📊 Use the reactions below to vote!`
      )
      .setFooter("Want to suggest something? Type it here!")
      .setColor(3426654);

    message.delete();
    message.channel.send(SuggestionEmbed).then((message) => {
      message.react("👍").then(() => message.react("👎"));
    });
  }

  if (
    message.mentions.users.first() &&
    !message.content.toLowerCase().startsWith(prefix)
  ) {
    const check = await profile.findOne({
      User: message.mentions.users.first().id,
    });
    if (check && check?.MentionNotif) {
      const person = await client.users.fetch(
        message.mentions.users.first().id
      );
      if (person) {
        let mentionedEmbed = new client.embed()
          .setDescription(
            `You were mentioned in **${message.guild.name}** by ${message.author.tag} | (${message.author.id})\n\n *Disable these notifications by running !mentionnotif*`
          )
          .setClear()
          .setTimestamp()
          .setFooter(
            `Vade Mention Notifications`,
            client.user.displayAvatarURL()
          )
          .setThumbnail(client.user.displayAvatarURL());

        await person.send(mentionedEmbed).catch(() => {
          console.log(
            `Unable to send ${person.tag} their mention notification.`
          );
        });
      }
    }
  }

  if(GuildConfig?.Automod) {
    let checkMessage = automod.checkMessage(message);

    if(checkMessage) {
      if(!message.deleted && message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) {
        let ModRoles = await client.utils.resolveModRole(message.guild.id);
        let AdminRoles = await client.utils.resolveAdminRole(message.guild.id);
        if(ModRoles) {
          let check = automod.checkMod(message.member, ModRoles);
          if(check) return;
      }
      if(AdminRoles) {
        let check = automod.checkAdmin(message.member, AdminRoles);
        if(check) return;
      }
        message.delete();
        let automodEmbed = new client.embed()
        .setTitle(`Automod Triggered!`)
        .setDescription(`${message.author} triggered the automod!`)
        .setClear()
        .setTimestamp()
        .setIcon(message.guild)
        .setFooter(`Vade Moderation`)
        message.channel.send(automodEmbed).then(async (msg) => {
          await wait(1000)
          // @ts-ignore
          if(!msg.deleted && msg.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) msg.delete();
        })
      }
    }
  }

  const randomXp = Math.floor(Math.random() * 18) + 1; //Random amount of XP until the number you want + 1
  const hasLeveledUp = await client.utils.appendXp(
      message.author.id,
      message.guild.id,
      randomXp
  );
  const schemaCheck = await module_schema.findOne({ Guild: message.guild.id });
  const find_levels = await level_role_schema.find({
    Guild: message.guild.id,
  });
  if (hasLeveledUp) {
    if (schemaCheck) {
      const array2 = await schemaCheck.get('Modules');
      if (array2.includes('levels')) {
        return;
      }
    }
    const user = await client.utils.fetch(
        message.author.id,
        message.guild.id,
        false
    );
    const levelChannel = GuildConfig?.levelChannel ? (client.channels.cache.get(GuildConfig.levelChannel) as TextChannel) : message.channel;
    levelChannel.send(
        // @ts-ignore
        `${message.author}, You leveled up to level **${user.level}**! Keep it going!`
    );
    if (find_levels) {
      for (const one of find_levels) {
        // @ts-ignore
        if (one.Level < user.level) {
          const locate_role = message.guild.roles.cache.get(one.Role);

          if (locate_role) {
            if (message.member.roles.cache.has(locate_role.id)) return;
            if (message.guild.me.permissions.has('MANAGE_ROLES')) {
              await message.member.roles.add(locate_role);
              levelChannel.send(
                  `${message.author} has earnt the **${locate_role.name}** role!`
              );
            }
          }
        }
      }
    }
  }

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  const args: string[] = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/);
  const cmd: string = args.shift().toLowerCase();
  const command: Command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (command) {
    try {
      if (client.cooldowns.has(`${message.author.id}-${command.name}`))
        return message.channel.send(
          `You are currently on a cooldown. You can use this Command again in ${ms(
            client.cooldowns.get(`${message.author.id}-${command.name}`) -
              Date.now(),
            { long: true }
          )}.`
        );
      if (command.botPerms) {
        for (const perm of command.botPerms) {
          if (!message.guild.me.permissions.has(perm)) {
            return message.channel.send(
              new client.embed()
                .setDescription(
                  `I am missing the ${perm} Permission that is required for this Command.`
                )
                .setColor(client.constants.colours.error)
            );
          }
        }
      }

      if (command.userPerms) {
        for (const perm of command.userPerms) {
          if (!message.member.permissions.has(perm)) {
            return message.channel.send(
              new client.embed()
                .setTitle(`Missing perms!`)
                .addField(`Missing permission`, `${perm}`)
                .setErrorColor()
            );
          }
        }
      }

      const checkPremium = await client.utils.checkPremium(
        message.guild.ownerID
      );
      const checkOwner = client.utils.checkOwner(message.author.id);
      const hasVoted = await client.utils.hasVoted(message.author.id);
      if (command.premiumOnly && !checkPremium) {
        return message.channel.send(
          `The Guild owner must have Vade Premium in order for you to run this Command!`
        );
      }

      if (command.devOnly && !checkOwner) {
        return message.channel.send(
          `This Command requires you to be a Vade Developer!`
        );
      }

      if (command.NSFW && !message.channel.nsfw) {
        return client.utils.sendError(
          `This Command can only be ran in an NSFW Channel!`,
          message.channel
        );
      }

      if (command.voteLocked && !hasVoted) {
        return client.utils.sendError(
          `This Command requires you to have voted at top.gg! You can vote via \`${prefix}vote\`.`,
          message.channel
        );
      }

      command.run(client, message, args, lang)
      await client.utils.reactIfAble(message, message.member, verified, ":white_check_mark:");
      if (
        GuildConfig?.cleanCommands &&
        message.guild.me.permissions.has("MANAGE_MESSAGES")
      ) {
        await wait(1000);
        if (!message.channel.deleted && !message.deleted)
          message.delete({
            timeout: 4000,
            reason: "Clean Commands are enabled.",
          });
      }
      if (!client.owners.includes(message.author.id)) {
        client.cooldowns.set(
          `${message.author.id}-${command.name}`,
          Date.now() + command.cooldown
        );
        setTimeout(() => {
          client.cooldowns.delete(`${message.author.id}-${command.name}`);
        }, command.cooldown);
      }
    } catch (e) {
      message.channel.send(
        new client.embed()
          .setTitle(`An error occured!`)
          .setDescription(`Error: ${e}`)
          .setErrorColor()
      );
    }
  }
};

export const name: string = "message";

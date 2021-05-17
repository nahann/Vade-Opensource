import { RunFunction } from "../../interfaces/Event";
import { Guild, Message } from "discord.js-light";
import { Command } from "../../interfaces/Command";
import profile from '../../models/profile';
import ms from "ms";
import GuildConfigSchema from "../../models/GuildConfig/guild";
import { promisify } from "util";
const wait = promisify(setTimeout);

export const run: RunFunction = async (client, message: Message) => {
  if (message.author.bot || !message.guild) return;
  if(message.channel.type !== 'text') return;
  const GuildConfig = await GuildConfigSchema.findOne({
    guildID: message.guild.id,
  });
  let mainPrefix: string = "!";
  if ((GuildConfig as any)?.prefix) {
    mainPrefix = (GuildConfig as any).prefix;
  }

  const mentionRegex = RegExp(`^<@!?${client.user.id}>( |)$`);
  const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);

  let prefix = message.content.match(mentionRegexPrefix)
  ? message.content.match(mentionRegexPrefix)[0]
  : mainPrefix;

  const suggestionChannelID = GuildConfig?.Suggestion;
  const checkProfile = await profile.findOne({ User: message.author.id });
  let lang = checkProfile?.Language ?? 'en';
  
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

  if(message.mentions.users.first() && !message.content.toLowerCase().startsWith(prefix)) {
    const check = await profile.findOne({ User: message.mentions.users.first().id });
    if(check && check?.MentionNotif) {
      const person = (await client.users.fetch(message.mentions.users.first().id));
      if(person) {
        let mentionedEmbed = new client.embed()
        .setDescription(`You were mentioned in **${message.guild.name}** by ${message.author.tag} | (${message.author.id})\n\n *Disable these notifications by running !mentionnotif*`)
        .setClear()
        .setTimestamp()
        .setFooter(`Vade Mention Notifications`, client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL());

        await person.send(mentionedEmbed).catch(() => {
          console.log(`Unable to send ${person.tag} their mention notification.`);
        });

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

      // if (command.NSFW && !message.channel.nsfw) {
      //   return client.utils.sendError(`This Command can only be ran in an NSFW Channel!`, message.channel)
      // }

      // if(command.voteRequired && !hasVoted) {

      // }

      command.run(client, message, args, lang);
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
      if(!client.owners.includes(message.author.id)) {
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

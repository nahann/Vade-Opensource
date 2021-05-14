import { RunFunction } from "../../interfaces/Event";
import { Guild, Message } from "discord.js-light";
import { Command } from "../../interfaces/Command";
import ms from "ms";
import GuildConfigSchema from "../../models/GuildConfig/guild";
import { promisify } from "util";
const wait = promisify(setTimeout);

export const run: RunFunction = async (client, message: Message) => {
  if (message.author.bot || !message.guild) return;
  const GuildConfig = await GuildConfigSchema.findOne({
    guildID: message.guild.id,
  });
  let prefix: string = "!";
  if ((GuildConfig as any)?.prefix) {
    prefix = (GuildConfig as any).prefix;
  }

  const suggestionChannelID = GuildConfig?.Suggestion;

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

      // if(command.voteRequired && !hasVoted) {

      // }

      command.run(client, message, args);
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
      client.cooldowns.set(
        `${message.author.id}-${command.name}`,
        Date.now() + command.cooldown
      );
      setTimeout(() => {
        client.cooldowns.delete(`${message.author.id}-${command.name}`);
      }, command.cooldown);
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

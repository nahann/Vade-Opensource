import { RunFunction } from "../../interfaces/Event";
import { Message } from "discord.js";
import { Command } from "interfaces/Command";
import ms from "ms";
import GuildConfigSchema from "../../../models/guild";

export const run: RunFunction = async (client, message: Message) => {
  const GuildConfig = await GuildConfigSchema.findOne({
    guildID: message.guild.id,
  });
  let prefix: string = "ts!";
  if ((GuildConfig as any)?.prefix) {
    prefix = (GuildConfig as any).prefix;
  }
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(prefix)
  )
    return;
  const args: string[] = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/);
  const cmd: string = args.shift().toLowerCase();
  const command: Command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;
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

    const checkPremium = await client.utils.checkPremium(message.guild.ownerID);
    const checkOwner = client.utils.checkOwner(message.author.id);
    if (command.premiumOnly && !checkPremium) {
      return message.channel.send(`The Guild owner must have Vade Premium in order for you to run this Command!`);
    }

    if (command.devOnly && !checkOwner) {
      return message.channel.send(
        `This Command requires you to be a Vade Developer!`
      );
    }

    command.run(client, message, args);
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
        .setTitle(`An unknown error occured!`)
        .setDescription(`Error: ${e}`)
        .setErrorColor()
    );
  }
};

export const name: string = "message";

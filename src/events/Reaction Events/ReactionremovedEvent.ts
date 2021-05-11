import { RunFunction } from "../../interfaces/Event";
import Db from "../../models/GuildConfig/ReactionRoles";
import { GuildMember, MessageReaction, User } from "discord.js-light";
const botCooldown = new Set();
const reactionCooldown = new Set();
import GuildDB from "../../models/GuildConfig/guild";

export const run: RunFunction = async (client, messageReaction, user) => {
  if (client.user.id === user.id) return;

  const { message, emoji } = messageReaction as MessageReaction;

  const member: GuildMember = await message.guild.members.fetch(user.id);

  const guildDB = await GuildDB.findOne({
    guildId: message.guild.id,
  });

  await Db.findOne(
    {
      guildID: message.guild.id,
      reaction: emoji.toString(),
      msgid: message.id,
    },

    async (err, db) => {
      if (!db) return;
      if (message.id !== db.msgid) return;
      const rrRole = await message.guild.roles.fetch(db.roleid);
      if (!rrRole) return;
      if (botCooldown.has(message.guild.id)) return;
      let guild = client.guilds.cache.get(db.guildID);
      let guildName = guild.name;
      let slowDownEmbed = new client.embed()
        .setDescription(
          `Slow down! You're on a cooldown!\n\nRole: **${client.utils.capitalise(
            rrRole.name
          )}**\nGuild: **${client.utils.capitalise(guildName)}**`
        )
        .setErrorColor()
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL());

      let addEmbed = new client.embed()
        .setAuthor(
          "Role Added",
          `https://i.pinimg.com/originals/ed/a7/f3/eda7f39a28ff7d7e34ad4d5e99fb814a.png`,
          `${message.url}`
        )
        .setDescription(
          `You have recieved the **${rrRole.name}** Role by reacting in ${guildName}`
        )
        .setSuccessColor()
        .setTimestamp();

      // remove reaction Embed
      let remEmbed = new client.embed()
        .setAuthor(
          "Role Removed",
          `https://i.pinimg.com/originals/ed/a7/f3/eda7f39a28ff7d7e34ad4d5e99fb814a.png`,
          `${message.url}`
        )
        .setDescription(
          `You have removed the **${rrRole.name}** Role by reacting in ${guildName}`
        )
        .setSuccessColor()
        .setTimestamp();

      //Reaction Role Error
      let errorReaction = new client.embed()
        .setAuthor(
          "Reaction Role Error",
          `https://i.pinimg.com/originals/ed/a7/f3/eda7f39a28ff7d7e34ad4d5e99fb814a.png`,
          `${message.url}`
        )
        .setDescription(
          ` Failed to Add the role, since I'm Missing the Manage Roles Permission.\n\nPlease let an admin Know.`
        )
        .setTimestamp()
        .setErrorColor();

      if (reactionCooldown.has(user.id)) return;

      if (db.option === 1) {
        try {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            await member.roles.remove(rrRole).catch(() => {});
            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 2000);

            if (guildDB.reactionDM) {
              if (botCooldown.has(message.guild.id)) return;
              await member.send(remEmbed).catch(() => {});
              botCooldown.add(message.guild.id);
              setTimeout(() => {
                botCooldown.delete(message.guild.id);
              }, 4000);
            }
          }
        } catch (err) {
          if (message.guild.me.permissions.has("MANAGE_ROLES")) return;
          if (botCooldown.has(message.guild.id)) return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
        }
      }

      if (db.option === 4) {
        try {
          if (
            !member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            await member.roles.add(rrRole).catch(() => {});
            if (guildDB.reactionDM) {
              return member.send(addEmbed).catch(() => {});
            }
            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 2000);
          }
        } catch (err) {
          if (!message.guild.me.permissions.has("MANAGE_ROLES")) return;
          if (botCooldown.has(message.guild.id)) return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
          return member.send(errorReaction).catch(() => {});
        }
      }
    }
  );
};
export const name: string = "messageReactionRemove";

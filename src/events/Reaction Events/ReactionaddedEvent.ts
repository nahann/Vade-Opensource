import { RunFunction } from "../../interfaces/Event";
import { MessageReaction, User } from "discord.js-light";
import moment from "moment";
const reactionCooldown = new Set();
import Db from "../../models/GuildConfig/ReactionRoles";
import GuildDB from "../../models/GuildConfig/guild";
import StarSchema from '../../models/starboardLogging';
import { GuildMember } from "discord.js-light";
const botCooldown = new Set();

export const run: RunFunction = async (client, messageReaction, user) => {
  console.log(`Running`);

  if (messageReaction.partial) await messageReaction.fetch();
  if (user.partial) await user.fetch();

  if (client.user.id === user.id) return;

  const { message, emoji } = messageReaction;

  const member = (await message.guild.members.fetch(user.id)) as GuildMember;

  const guildDB = await GuildDB.findOne({
    guildId: message.guild.id,
  });

  //find in database
  await Db.findOne(
    {
      guildID: message.guild.id,
      reaction: emoji.toString(),
      msgid: message.id,
    },

    async (err, db) => {
      if (err) console.log(err);

      // return if reaction isnt in database

      if (!db && emoji !== "⭐") {


      console.log(`Star added`);
      

        
        return;

      }

      // return if the reaction's message ID is different than in database

      if (message.id !== db.msgid) return;

      // fetch the role to give
      const rrRole = message.guild.roles.cache.get(db.roleid);

      // return if role doesn't exist
      if (!rrRole) return;

      // return (avoid rate limit + SPAM)
      if (botCooldown.has(message.guild.id)) return;

      let guild = client.guilds.cache.get(db.guildID);
      let guildName = guild.name;

      let slowDownEmbed = new client.embed()
        .setDescription(
          `Slow Down There, You're on a cooldown\n\n**Role Name:** ${rrRole.name}\n**Guild Name:** ${guildName}`
        )
        .setErrorColor();

      // add reaction Embed
      let addEmbed = new client.embed()
        .setAuthor(
          "Role Added",
          `https://i.pinimg.com/originals/ed/a7/f3/eda7f39a28ff7d7e34ad4d5e99fb814a.png`,
          `${message.url}`
        )
        .setDescription(
          `You have recieved the **${rrRole.name}** Role by reacting in ${guildName}`
        )
        .setFooter(`Vade Reaction Roles`)
        .setSuccessColor();

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
        .setFooter(`Vade Reaction Roles`)
        .setSuccessColor();

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
        .setFooter(`Vade Reaction Roles`)
        .setErrorColor();

      if (reactionCooldown.has(user.id)) {
        //Add user to a cooldown if he is spamming
        user.send(slowDownEmbed).catch(() => {});
        botCooldown.add(message.guild.id);
        setTimeout(() => {
          botCooldown.delete(message.guild.id);
        }, 4000);
      }

      //checking for options
      if (db.option === 1) {
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
        } catch {
          if (!message.guild.me.permissions.has("MANAGE_ROLES")) return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
        }
      }

      if (db.option === 2) {
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
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
          return member.send(errorReaction).catch(() => {});
        }
      }

      if (db.option === 3) {
        try {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            await member.roles.remove(rrRole).catch(() => {});
            if (guildDB.reactionDM) {
              return member.send(remEmbed).catch(() => {});
            }
            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 2000);
          }
        } catch (err) {
          if (
            !message.channel
              .permissionsFor(message.guild.me)
              .has("SEND_MESSAGES")
          )
            return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
          return member.send(errorReaction).catch(() => {});
        }
      }

      if (db.option === 4) {
        try {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            await member.roles.remove(rrRole).catch(() => {});
            reactionCooldown.add(user.id);
            if (guildDB.reactionDM) {
              return member.send(remEmbed).catch(() => {});
            }
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 2000);
          }
        } catch (err) {
          if (
            !message.channel
              .permissionsFor(message.guild.me)
              .has("SEND_MESSAGES")
          )
            return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
          return member.send(errorReaction).catch(() => {});
        }
      }

      if (db.option === 5) {
        try {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            await member.roles.remove(rrRole);
            message.reactions.cache
              .find((r) => r.emoji.name == emoji.name)
              .users.remove(user.id)
              .catch(() => {});

            if (guildDB.reactionDM) {
              return member.send(remEmbed).catch(() => {});
            }
            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 2000);
          }
        } catch (err) {
          if (!message.guild.me.permissions.has("MANAGE_ROLES")) return;
          botCooldown.add(message.guild.id);
          setTimeout(() => {
            botCooldown.delete(message.guild.id);
          }, 6000);
          return member.send(errorReaction).catch(() => {});
        }
      }

      if (db.option === 6) {
        try {
          if (
            member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            message.reactions.cache
              .find((r) => r.emoji.name == emoji.name)
              .users.remove(user.id)
              .catch(() => {});
            await member.roles.remove(rrRole).catch(() => {});

            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 5000);

            return;
          } else if (
            !member.roles.cache.find(
              (r) => r.name.toLowerCase() === rrRole.name.toLowerCase()
            )
          ) {
            message.reactions.cache
              .find((r) => r.emoji.name == emoji.name)
              .users.remove(user.id)
              .catch(() => {});
            await member.roles.add(rrRole).catch(() => {});

            if (guildDB.reactionDM) {
              return member.send(addEmbed).catch(() => {});
            }
            reactionCooldown.add(user.id);
            setTimeout(() => {
              reactionCooldown.delete(user.id);
            }, 5000);
          }
        } catch (err) {
          if (!message.guild.me.permissions.has("MANAGE_ROLES")) return;
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
export const name: string = "messageReactionAdd";

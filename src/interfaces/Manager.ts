import { Bot } from "../client/Client";
import DBL from "dblapi.js";
import { TextChannel } from "discord.js-light";
import ms from "ms";
import p from "phin";

import vote_schema from "../models/voteremind";
import premium_schema from "../models/premium_schema";
import { GiveawaysManager } from "discord-giveaways";
import mongoose from 'mongoose';

export default (client: Bot) => {
  // both bots
  const giveawaySchema = new mongoose.Schema({
    messageID: String,
    channelID: String,
    guildID: String,
    startAt: Number,
    endAt: Number,
    ended: Boolean,
    winnerCount: Number,
    prize: String,
    messages: {
      giveaway: String,
      giveawayEnded: String,
      inviteToParticipate: String,
      timeRemaining: String,
      winMessage: String,
      embedFooter: String,
      noWinner: String,
      winners: String,
      endedAt: String,
      hostedBy: String,
      exemptMembers: String,
      units: {
        seconds: String,
        minutes: String,
        hours: String,
        days: String,
        pluralS: Boolean,
      },
    },
    hostedBy: String,
    winnerIDs: [],
    reaction: String,
    botsCanWin: Boolean,
    embedColor: String,
    embedColorEnd: String,
    exemptPermissions: [],
    extraData: {},
  });

  // Create the model
  const giveawayModel = mongoose.model("test-giveaways", giveawaySchema);

  class GiveawaysManagerWithMongoose extends GiveawaysManager {
    
    async getAllGiveaways() {
      // Get all the giveaways in the database. We can use the messageID field to fetch all documents by passing an empty condition.
      const g = await giveawayModel.find({});
      client.logger.info("Giveaways", "Getting all giveaways");
      return g;
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(_messageID, giveawayData) {
      // Add the new one
      await giveawayModel.create(giveawayData);
      // Don't forget to return something!
      return true;
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageID, giveawayData) {
      // Find by messageID and update it
      if (!messageID) return;
      await giveawayModel
        .findOneAndUpdate({ messageID: messageID }, giveawayData)
        .exec();
      // Don't forget to return something!
      return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID) {
      await giveawayModel.findOneAndDelete({ messageID: messageID }).exec();
      return true;
    }
    generateMainEmbed(giveaway) {
      let roleID;
      let serverName;

      if (giveaway.extraData) {
        if (giveaway.extraData.roleRequirement) {
          roleID = giveaway.extraData.roleRequirement;
        }
        if (giveaway.extraData.serverRequirement) {
          serverName = client.guilds.cache.get(
            giveaway.extraData.serverRequirement
          ).name;
        }
      }

      const embed = new this.client.embed();
      embed
        .setAuthor(giveaway.prize)
        .setColor(giveaway.embedColor)
        .setFooter(
          `${giveaway.winnerCount} ${giveaway.messages.winners} • ${giveaway.messages.embedFooter}`
        )
        .setDescription(
          giveaway.messages.inviteToParticipate +
            "\n" +
            giveaway.remainingTimeText +
            "\n" +
            (giveaway.hostedBy
              ? giveaway.messages.hostedBy.replace("{user}", giveaway.hostedBy)
              : "") +
            (giveaway.extraData && giveaway.extraData.roleRequirement
              ? "\nRole Requirement: " + `<@&${roleID}>`
              : "") +
            (giveaway.extraData && giveaway.extraData.serverRequirement
              ? "\nServer Recommended : " +
                `**[${serverName}](https://vade-bot.com)**`
              : "") +
            (giveaway.extraData && giveaway.extraData.inviteRequirement
              ? "\nInvites Required: " +
                `**${giveaway.extraData.inviteRequirement}**`
              : "")
        )
        .setTimestamp(new Date(parseInt(giveaway.endAt)));
      return embed;
    }

    async roll(winnerCount) {
      if (!this.message) return [];
      // Pick the winner
      const reactions = this.message.reactions.cache;
      const reaction =
        reactions.get(this.reaction) ||
        reactions.find((r) => r.emoji.name === this.reaction);
      if (!reaction) return [];
      const guild = this.channel.guild;
      // Fetch guild members
      if (this.manager.options.hasGuildMembersIntent)
        await guild.members.fetch();
      const users = (await reaction.users.fetch())
        .filter((u) => !u.bot || u.bot === this.botsCanWin)
        .filter((u) => u.id !== this.message.client.user.id);

      let userArray;
      if (
        this.extraData &&
        this.extraData.bonusEntryRoles &&
        this.extraData.bonusEntryRoles.every(
          (ber) =>
            Object.keys(ber).every((k) => k === "roleID" || k === "entries") &&
            typeof ber.roleID === "string" &&
            typeof ber.entries === "number"
        )
      ) {
        userArray = users.array().slice(); // Copy all users once
        /**
         * Each user who has a bonus entry role is pushed into the array
         * until they are in the array as many times as has been specified for the bonus entry role with the highest entrie amount which they own
         */
        for (const user of userArray.slice()) {
          const isUserValidEntry = await this.checkWinnerEntry(user);
          if (!isUserValidEntry) continue;

          const validBonusEntryRoles = this.extraData.bonusEntryRoles.filter(
            (ber) => Number.isInteger(ber.entries) && ber.entries > 1
          );
          if (!validBonusEntryRoles.length) continue;
          const memberRoles = this.channel.guild
            .member(user.id)
            .roles.cache.array();
          const intersectedRoles = validBonusEntryRoles.filter((ber) =>
            memberRoles.map((r) => r.id).includes(ber.roleID)
          );
          if (!intersectedRoles.length) continue;

          const highestEntries = Math.max.apply(
            Math,
            intersectedRoles.map((ber) => ber.entries)
          );
          for (let i = 0; i < highestEntries - 1; i++) userArray.push(user);
        }
      }

      let rolledWinners;
      if (!userArray || userArray.length <= (winnerCount || this.winnerCount)) {
        rolledWinners = users.random(
          Math.min(winnerCount || this.winnerCount, users.size)
        );
      } else {
        /** The same as https://github.com/discordjs/collection/blob/master/src/index.ts#L193
         * because collections/maps do not allow dublicates and so we need our own roll mechanism for the userArray
         */
        const amount = winnerCount || this.winnerCount;
        if (!amount)
          rolledWinners =
            userArray[Math.floor(Math.random() * userArray.length)];
        else
          rolledWinners = Array.from(
            { length: Math.min(amount, users.size) },
            () =>
              userArray.splice(
                Math.floor(Math.random() * userArray.length),
                1
              )[0]
          );
      }

      const winners = [];

      for (const u of rolledWinners) {
        const isValidEntry =
          (await this.checkWinnerEntry(u)) &&
          !winners.some((winner) => winner.id === u.id);
        if (isValidEntry) winners.push(u);
        else {
          // find a new winner
          for (const user of users.array()) {
            const alreadyRolled = winners.some(
              (winner) => winner.id === user.id
            );
            if (alreadyRolled) continue;
            const isUserValidEntry = await this.checkWinnerEntry(user);
            if (!isUserValidEntry) continue;
            else {
              winners.push(user);
              break;
            }
          }
        }
      }

      return winners.map((user) => guild.member(user) || user);
    }
  }
  // issue is that this file needs to be registered within each giveaway cmd file so that .start() is recognised

  // Create a new instance of your new class
  const manager = new GiveawaysManagerWithMongoose(client, {
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: true,
    endedGiveawaysLifetime: ms("10s"),
    default: {
      botsCanWin: false,
      exemptPermissions: [],
      embedColor: "#FF0000",
      embedColorEnd: "#FD2F03",
      reaction: "833110730374119475",
    },
  }); // it must not be able to read the // console log manager
  // We now have a giveawaysManager property to access the manager everywhere!

};

export async function remindToVote(bot: Bot, userId: string) {
  const dateCanVote = Date.now() + ms("12h");

  const voteLogs = bot.guilds.cache
    .get(bot.config.MAIN_GUILD)
    .channels.cache.get("795711027567263846") as TextChannel;

  bot.logger.info(`User with ID ${userId} just voted on top.gg!`);
  voteLogs.send(
    `<@${userId}> just voted for the Bot on top.gg! (ID: **${userId}**)`
  );

  const voteSchema = await vote_schema.findOne({ User: userId });
  if (!voteSchema) {
    const newVoteSchema = new vote_schema({
      User: userId,
      Time: dateCanVote,
      Enabled: true,
      Messaged: false,
    });

    await newVoteSchema.save();
    const user = bot.users.cache.get(userId);
    return user.send(
      `Thanks for voting for the Bot on top.gg! You will be reminded in 12 hours when you can vote again! To disable reminders simply run the Command \`!voteremind disable\`.`
    );
  } else {
    await voteSchema.updateOne({
      Time: dateCanVote,
      Messaged: false,
    });
  }
}

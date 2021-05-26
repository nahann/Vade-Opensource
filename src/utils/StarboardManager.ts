import phin from "phin";
import GuildSchema from "../models/GuildConfig/guild";
import StarboardSchema from "../models/starboardLogging";

import type { RESTGetAPIChannelMessageReactionUsersResult as MessageReactionsResult } from "discord-api-types";
import type {
  MessageReaction,
  User,
  TextChannel,
  Channel,
  Message,
} from "discord.js-light";
import type { Bot } from "../client/Client";

export namespace StarboardManager {
  const EMOJI = "⭐";
  const STARS_REQUIRED = 1;

  const getContent = (channel: Channel, count: number) =>
    `${channel} | **${count}** ${EMOJI}`;

  export async function onReactionAdd(reaction: MessageReaction, user: User) {
    /* make sure the reaction passed is a star */
    if (reaction.emoji.name !== EMOJI) {
      return;
    }

    const message = await reaction.message.fetch();
    const client = message.client as Bot;
    const settings = await GuildSchema.findOne({ guildID: message.guild.id });
    const starboardChannel: TextChannel | null = settings?.Starboard
      ? ((await client.channels.fetch(settings.Starboard)) as TextChannel)
      : null;

    if (!starboardChannel) {
      return;
    }

    reaction = await reaction.fetch();
    const boardEntry = await StarboardSchema.findOne({
      Guild: message.guild.id,
      User: message.author.id,
      Channel: message.channel.id,
      Message: message.id,
    });

    if (boardEntry) {
      /* check if the number of reactions is higher */
      console.log(reaction.count);
      console.log(boardEntry.Amount);
      if (reaction.count > boardEntry.Amount) {
        const boardMessage = await starboardChannel.messages.fetch(
          boardEntry.StarboardMessage
        );
        if (!boardMessage) {
          return;
        }

        await boardMessage
          .edit(getContent(message.channel, reaction.count))
          .then((msg) => boardEntry.updateOne({ $inc: { Amount: 1 } }));
      }

      return;
    }

    const starsRequired = settings?.StarAmount ?? STARS_REQUIRED;
    if (starsRequired > reaction.count) {
      return;
    }

    message.channel.send("Star amount reached."); /* for debugging purposes  */

    if (
      starboardChannel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
    ) {
      const embed = new client.embed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
          `[Jump to Message](${message.url})\n\n${
            message.content?.length ? `"${message.content}"` : ""
          }`
        )
        .setClear()
        .setIcon(message.guild)
        .setTimestamp();

      let Attachment = message.attachments?.array();
      message.attachments.size ? embed.setImage(Attachment[0].proxyURL) : "";

      const boardMessage = await starboardChannel.send(
        `${message.channel} | **${reaction.count}** ${EMOJI}`,
        embed
      );
      const newBoardEntry = new StarboardSchema({
        Guild: message.guild.id,
        User: message.author.id,
        Amount: reaction.count,
        Channel: message.channel.id,
        Message: message.id,
        StarboardMessage: boardMessage.id,
      });

      await newBoardEntry.save();
    }
  }

  export async function onReactionRemove(
    reaction: MessageReaction,
    user: User
  ) {
    /* check if the removed emoji is the star emoji */
    if (reaction.emoji.name !== EMOJI) {
      return;
    }

    const message = await reaction.message.fetch();
    const client = message.client as Bot;
    const settings = await GuildSchema.findOne({ guildID: message.guild.id });

    /* get the starboard channel. */
    const starboardChannel: TextChannel | null = settings?.Starboard
      ? ((await client.channels.fetch(settings.Starboard)) as TextChannel)
      : null;
    if (!starboardChannel) {
      return;
    }

    /* get the board entry */
    const boardEntry = await StarboardSchema.findOne({
      Guild: message.guild.id,
      User: message.author.id,
      Channel: message.channel.id,
      Message: message.id,
    });

    if (!boardEntry) {
      return;
    }

    reaction = await reaction.fetch();

    /* get the starboard message. */
    const boardMessage = await starboardChannel.messages.fetch(
      boardEntry.StarboardMessage
    );
    if (!boardMessage) {
      return;
    }

    /* check if there are no more reactions on the message. */
    if (reaction.count <= 0) {
      await boardEntry.delete();
      await boardMessage.delete();
      return;
    }

    /* edit the board message */
    await boardMessage.edit(getContent(message.channel, reaction.count));

    /* update the board entry */
    await boardEntry.updateOne({ $inc: { Amount: -1 } });
  }

  export async function onRemoveEmoji(reaction: MessageReaction) {
    if (reaction.emoji.name !== EMOJI) {
      return;
    }

    const message = await reaction.message.fetch();
    const client = message.client as Bot;
    const settings = await GuildSchema.findOne({ guildID: message.guild.id });

    /* get the starboard channel. */
    const starboardChannel: TextChannel | null = settings?.Starboard
      ? ((await client.channels.fetch(settings.Starboard)) as TextChannel)
      : null;
    if (!starboardChannel) {
      return;
    }

    const boardEntry = await StarboardSchema.findOne({
      Message: message.id,
      Channel: message.channel.id,
      User: message.author.id,
      Guild: message.guild.id,
    });

    if (!boardEntry) {
      return;
    }

    /* get the starboard message. */
    const boardMessage = await starboardChannel.messages.fetch(
      boardEntry.StarboardMessage
    );
    if (!boardMessage) {
      return;
    }

    /* delete the board entry and message. */
    await boardMessage.delete();
    await boardEntry.delete();
  }

  export async function onRemoveAll(message: Message) {
    const boardEntry = await StarboardSchema.findOne({
      Message: message.id,
      Channel: message.channel.id,
      User: message.author.id,
      Guild: message.guild.id,
    });

    if (boardEntry) {
      await boardEntry.delete();

      const client = message.client as Bot;
      const settings = await GuildSchema.findOne({ guildID: message.guild.id });

      /* get the starboard channel. */
      const starboardChannel: TextChannel | null = settings?.Starboard
        ? ((await client.channels.fetch(settings.Starboard)) as TextChannel)
        : null;
      if (!starboardChannel) {
        return;
      }

      /* get the starboard message. */
      const boardMessage = await starboardChannel.messages.fetch(
        boardEntry.StarboardMessage
      );
      if (boardMessage) {
        await boardMessage.delete();
      }
    }
  }
}

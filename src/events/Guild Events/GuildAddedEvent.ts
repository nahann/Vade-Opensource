import { RunFunction } from "../../interfaces/Event";
import GuildSchema from "../../models/GuildConfig/guild";
import { Types } from "mongoose";

import type { TextChannel } from "discord.js";
import { Guild } from "discord.js";
import { MessageButton } from "../../utils/buttons/src";

export const run: RunFunction = async (client, guild: Guild) => {
  const owner = await client.users.fetch(guild.ownerID);
  const newGuildEmbed = new client.embed()
    .setTitle(`Added to a Server!`)
    .addField(`Guild`, `Guild Name: ${guild.name} (${guild.id})`)
    .addField(`Owner Info`, `Owner: ${owner.tag} (${guild.ownerID})`)
    .addField(`Member Info`, `${guild.memberCount} Members!`)
    .setMainColor()
    .setTimestamp();

  const channel: TextChannel = (
    await client.guilds.fetch(client.config.MAIN_GUILD)
  ).channels.cache.get("796828146954534973") as TextChannel;

  channel.send(newGuildEmbed) ?? null;

  const document = await GuildSchema.findOne({ guildID: guild.id });

  let sendEmbed = new client.embed()
    .setTitle(`Thanks for adding me to your Server!`)
    .setDescription(
      `Hello! Thank you for adding Vade to your server! \n\nFor a list of Commands you can run \`!help\`. \nIf you'd like help on a specific command/category, you can do \`!help <Command/Category>\`.`
    )
    .addField(`Support Server`, `https://discord.com/invite/DFa5wNFWgP`)
    .addField(`Lead Developer`, `Ethan#7000 (473858248353513472)`);

    let button = new MessageButton()
    .setStyle(5)
    .setLabel(`Support Server`)
    .setURL(`https://vade-bot.com/discord`)

  if (
    guild.systemChannel &&
    guild.systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES") &&
    guild.systemChannel.permissionsFor(guild.me).has("EMBED_LINKS")
  ) {
    // @ts-ignore
    guild.systemChannel?.send(sendEmbed, { buttons: [ button ]});
  }

  if (document) return; // Maintain old data

  const newGuild = new GuildSchema({
    _id: Types.ObjectId(),
    guildName: guild.name,
    guildID: guild.id,
    prefix: "!",
  });

  await newGuild.save();
};

export const name: string = "guildCreate";

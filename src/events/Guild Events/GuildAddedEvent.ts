import { RunFunction } from "../../interfaces/Event";
import GuildSchema from "../../models/GuildConfig/guild";

import type { TextChannel } from "discord.js-light";

export const run: RunFunction = async (client, guild) => {
  const owner = await client.users.fetch(guild.ownerID);
  const newGuildEmbed = new client.embed()
    .setTitle(`Added to a Server!`)
    .addField(`Guild`, `Guild Name: ${guild.name} (${guild.id})`)
    .addField(`Owner Info`, `Owner: ${owner.tag} (${guild.ownerID})`)
    .setMainColor();

  const channel: TextChannel = client.guilds.cache
    .get(client.config.MAIN_GUILD)
    .channels.cache.get("796828146954534973") as TextChannel;

  channel.send(newGuildEmbed) ?? null;

  const document = await GuildSchema.findOne({ guildID: guild.id });
  if (document) {
    // the document already exists.
    return;
  }

  const newGuild = new GuildSchema({
    guildName: guild.name,
    guildID: guild.id,
    prefix: "!",
  });

  await newGuild.save();
};

export const name: string = "guildCreate";

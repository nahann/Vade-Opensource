import { RunFunction } from "../../interfaces/Event";
import guild_schema from "../../../models/GuildConfig/guild";
import { TextChannel } from "discord.js";

export const run: RunFunction = async (client, guild) => {
  let fetch = await client.users.fetch(guild.ownerID);
  let tag = fetch.tag;

  let newGuildEmbed = new client.embed()
    .setTitle(`Added to a Server!`)
    .addField(`Guild`, `Guild Name: ${guild.name} (${guild.id})`)
    .addField(`Owner Info`, `Owner: ${tag} (${guild.ownerID})`)
    .setMainColor();

  const channel: TextChannel = client.guilds.cache
    .get(client.config.MAIN_GUILD)
    .channels.cache.get("796828146954534973") as TextChannel;
  channel.send(newGuildEmbed) ?? null;

  const data_check = await guild_schema.findOne({ guildID: guild.id });
  if (data_check) return;

  const newGuild = new guild_schema({
    guildName: guild.name,
    guildID: guild.id,
    prefix: "!",
  });

  await newGuild.save();
};
export const name: string = "guildCreate";

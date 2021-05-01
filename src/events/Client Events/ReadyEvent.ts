import { RunFunction } from "../../interfaces/Event";
import SlashCommandManager from "../../Classes/SlashCommandManager";
import { GuildMember } from "discord.js";

export const run: RunFunction = async (client) => {
  const manager = new SlashCommandManager(client);
  
  await manager.load("./src/slash"); await manager.register(); await manager.listen();
  
  client.logger.success(`${client.user.tag} is now online!`);

  const nf = Intl.NumberFormat();

  const activities = {
    get "0"() {
      return `${client.guilds.cache.size} servers!`;
    },
    get "1"() {
      return `discord.gg/vadebot | vade-bot.com`;
    },
    get "2"() {
      return `${nf.format(
        client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
      )} users!`;
    },
  };


  client.guilds.cache.forEach(async (guild) => {
    if(guild.me.permissions.has("ADMINISTRATOR")) {
      let invites = await guild.fetchInvites();
      if(invites) client.invites.set(guild.id, invites);
    }
  });

  let i = 0;
  setInterval(
    () =>
      client.user.setActivity(`!help | ${activities[i++ % 3]}`, {
        type: "WATCHING",
      }),
    15000
  );




};

export const name: string = "ready";

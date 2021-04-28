import { RunFunction } from "../../interfaces/Event";
import SlashCommandManager from "../../Classes/SlashCommandManager";

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
      return `${client.channels.cache.size} channels!`;
    },
    get "2"() {
      return `${nf.format(
        client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
      )} users!`;
    },
  };

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

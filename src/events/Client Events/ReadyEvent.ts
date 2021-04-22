import { RunFunction } from "../../interfaces/Event";

export const run: RunFunction = async (client) => {
  client.logger.success(`${client.user.tag} is now online!`);

    const nf = Intl.NumberFormat();

  const activities = [
    `${client.guilds.cache.size} servers!`,
    `${client.channels.cache.size} channels!`,
    `${nf.format(
      client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
    )} users!`,
  ];

  let i = 0;
  setInterval(
    () =>
      client.user.setActivity(
        `!help | ${activities[i++ % activities.length]}`,
        { type: "WATCHING" }
      ),
    15000
  );


};



export const name: string = "ready";

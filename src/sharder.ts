import "module-alias/register";

import { isMaster } from "cluster";
import { join } from "path";
import { ShardingManager, SharderEvents } from "kurasuta";
import { Intents } from "discord.js";

import { Bot } from "./client/Client";
import { Config } from "./interfaces/Config";
import * as File from "./config.json";

const main = async () => {
  const sharder = new ShardingManager(join(__dirname, "vade.js"), {
    client: Bot,
    token: File.token,
    development: true,
    timeout: 15000,
    shardCount: 1,
    clusterCount: 1,
    clientOptions: {
      ws: { intents: Intents.ALL },
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
      messageCacheLifetime: 180,
      messageCacheMaxSize: 200,
      messageEditHistoryMaxSize: 200,
      messageSweepInterval: 180,
      restTimeOffset: 0,
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: true,
    }
  });

  console.log("lol")

  sharder.on(SharderEvents.DEBUG, message => console.debug(`[sharder] ${message}`));
  sharder.on(SharderEvents.SHARD_READY, shard => console.log(`Starting shard ${shard}`));

  await sharder.spawn()
    .then(() => console.log(`Spawning shard, count = ${sharder.shardCount}`))
    .catch(reason => console.error("Error occurred while spawning shards,", reason));
};

// if (isMaster) {
  void main();
// }
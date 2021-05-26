import "module-alias/register";

import { Logger } from "@dimensional-fun/logger";
import { isMaster } from "cluster";
import { join } from "path";
import { ShardingManager, SharderEvents } from "kurasuta";
import { Intents } from "discord.js";

import { Bot } from "./client/Client";
import * as File from "./config.json";

// if (isMaster) {
const main = async () => {
  const logger = new Logger("sharder");
  const sharder = new ShardingManager(join(__dirname, "vade.js"), {
    client: Bot,
    token: File.token,
    timeout: 15000,
    // shardCount: 1,
    // clusterCount: 1,
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
    },
  });

  sharder.on(SharderEvents.READY, (message) => logger.info("Ready now"));
  sharder.on(SharderEvents.DEBUG, (message) => logger.debug(message));
  sharder.on(SharderEvents.SHARD_READY, (shard) =>
    logger.info(`Starting shard ${shard}, [${process.pid}]`)
  );
  sharder.on(SharderEvents.SPAWN, (cluster) =>
    logger.info(`Spawning cluster; id=${cluster.id}`)
  );

  await sharder
    .spawn()
    .then(() =>
      logger.info(
        `Spawning shards, count = ${sharder.shardCount}, [${process.pid}]`
      )
    )
    .catch((reason) =>
      logger.error("Error occurred while spawning shards,", reason)
    );
};

void main();
// }

import "module-alias/register";

import { Logger } from "@dimensional-fun/logger";
import { ShardingManager, SharderEvents } from "kurasuta";
import { join } from "path";

import { Bot } from "./client/Client";
import * as File from "./config.json";

// if (isMaster) {
const main = async () => {
  const logger = new Logger("sharder");
  const sharder = new ShardingManager(join(__dirname, "vade.js"), {
    client: Bot,
    token: File.token,
    timeout: 15000,
    shardCount: 1,
    clusterCount: 1,
  });

  sharder.on(SharderEvents.READY, _ => logger.info("Ready now"));
  sharder.on(SharderEvents.DEBUG, msg => logger.debug(msg));
  sharder.on(SharderEvents.SHARD_READY, id => logger.info(`Starting shard ${id}, [${process.pid}]`));
  sharder.on(SharderEvents.SPAWN, ({ id }) => logger.info(`Spawning cluster; id=${id}`));

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

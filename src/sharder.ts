import "module-alias/register";

import { Bot } from "./client/Client";
import { ShardingManager } from "kurasuta";
import { isMaster } from "cluster";
import { join } from "path";

const main = async () => {
  const sharder = new ShardingManager(join(__dirname, "./vade.ts"), {
    client: Bot,
    token: "",
  });

  await sharder.spawn();
};

if (isMaster) {
  void main();
}

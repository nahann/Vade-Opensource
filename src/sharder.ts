import "module-alias/register";

import { Bot } from "./client/Client";
import { ShardingManager } from "kurasuta";
import { isMaster } from "cluster";
import { join } from "path";

const main = async () => {
  const sharder = new ShardingManager(join(__dirname, './vade.ts'), {
    client: Bot,
    token: "ODAzOTY5NTEzMzM3OTEzMzk0.YBFg9Q.2_pMDwLp_gGWacHHAeWFXfxSKvM",
  });

  await sharder.spawn();
};

if (isMaster) {
  void main();
}
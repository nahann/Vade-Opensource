import { ShardingManager } from "kurasuta";
import { Bot } from "./client/Client";


const sharder = new ShardingManager("./vade.js", {
  client: Bot,
  token: "ODAzOTY5NTEzMzM3OTEzMzk0.YBFg9Q.2_pMDwLp_gGWacHHAeWFXfxSKvM"
})

sharder.spawn();
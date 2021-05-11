import { ShardingManager } from "kurasuta";

import { Bot } from "./client/Client";

const sharder = new ShardingManager("./vade.js", {
  client: Bot,
  token: 
})
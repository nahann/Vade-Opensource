import "discord.js-light";
import * as File from "./config.json";
import { Bot } from "./client/Client";

import type { Config } from "./interfaces/Config";

process.on("unhandledRejection", (err) => {
    console.log(err)
})

new Bot({}).start(File as Config);


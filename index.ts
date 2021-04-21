import { Config } from "./src/interfaces/Config";
import * as File from "./config.json";
import { Bot } from "./src/client/Client";

new Bot().start(File as Config);

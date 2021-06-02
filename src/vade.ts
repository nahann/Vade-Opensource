import { BaseCluster } from "kurasuta";
import "discord.js";
import * as File from "./config.json";

import type { Config } from "./interfaces/Config";
import type { Bot } from "./client/Client";

export default class extends BaseCluster {
  readonly client!: Bot;

  async launch() {
    await this.client.start(File as Config);
  }
}

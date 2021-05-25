import { BaseCluster } from "kurasuta";
import "discord.js-light";
import { Config } from "./interfaces/Config";
import * as File from "./config.json";
import { Bot } from "./client/Client";

export default class extends BaseCluster {
  readonly client!: Bot;

  async launch() {
    await this.client.start(File as Config);
  }
}

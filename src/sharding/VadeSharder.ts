import phin from "phin";
import { cpus } from "os";
import { isMaster, setupMaster } from "cluster";
import { APIGatewayBotInfo } from "discord-api-types/v8";
import { Consola } from "consola";

export class VadeSharder {
  static DEFAULTS: VadeSharderOptions = {
    clusterSize: 2,
    clusters: cpus().length,
    shards: "auto",
  };

  /**
   * The token used by each shard.
   */
  readonly token: string;

  /**
   * The file to launch
   */
  readonly file: string;

  /**
   * The options passed to this sharder.
   */
  readonly options: VadeSharderOptions;

  /**
   * The number of shards being spawned.
   */
  shardCount: number;

  private readonly log: Consola = new Consola({});

  constructor(
    token: string,
    file: string,
    options: Partial<VadeSharderOptions> = {}
  ) {
    this.options = Object.assign(options, VadeSharder.DEFAULTS);
    this.token = token;
    this.file = file;
  }

  /**
   * Spawns a bunch of shards.
   */
  async spawn() {
    if (isMaster) {
      if (this.options.shards === "auto") {
        const { shards: discordRecommended } = await this.fetchGatewayInfo();
        this.shardCount = discordRecommended;
      }

      this.log.debug(
        `Starting ${this.shardCount} shards in ${this.options.clusters} clusters.`
      );

      const shards = Array.from({ length: this.shardCount }, (_, i) => i);
    } else {
      // TODO: start cluster.
    }
  }

  /**
   * Fetches the session start limit
   */
  async fetchGatewayInfo(): Promise<APIGatewayBotInfo> {
    const { body } = await phin<APIGatewayBotInfo>({
      url: "https://discord.com/api/v9/gateway/bot",
      parse: "json",
    });

    return body;
  }
}

interface VadeSharderOptions {
  /**
   * The number of shards to spawn.
   *
   * - "auto" uses the number of shards recommended by discord.
   */
  shards: "auto" | number;

  /**
   * The number of clusters.
   */
  clusters: number;

  /**
   * The number of shards per-cluster.
   */
  clusterSize: number;
}

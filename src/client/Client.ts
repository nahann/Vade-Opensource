import { Logger } from "@dimensional-fun/logger";

import { Client, Intents, Collection, ClientOptions } from "discord.js-light";
import glob from "glob";
import { promisify } from "util";
import Constants from "../interfaces/Constants";
import Util from "../interfaces/Util";
import Mongo from "../interfaces/Database";
import EmbedConstruction from "../Classes/MainBotEmbed";
import Lottery from "../utils/Scheduled";
import { I18n } from "i18n";
import path from "path";
import MainManager from "../interfaces/Manager";

import { API } from "../api/API";

import buttons from "../utils/buttons/src/index";

import type { Manager } from "erela.js";
import type { Config } from "../interfaces/Config";
import type { Command } from "../interfaces/Command";
import type { Event } from "../interfaces/Event";
import type InteractionCreate from "../utils/buttons/typings/Classes/INTERACTION_CREATE";

const i18n = new I18n({
  locales: ["en", "ro"],
  directory: path.join(__dirname, "../Locales"),
  objectNotation: true,
  defaultLocale: "en",
});

const globPromise = promisify(glob);

export class Bot extends Client {
  public static __instance__?: Bot;

  public logger: Logger = new Logger("vade");
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public categories: Set<string> = new Set();
  public utils: Util = new Util(this);
  public embed: typeof EmbedConstruction = EmbedConstruction;
  public events: Collection<string, Event> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public config: Config;
  public constants: typeof Constants = Constants;
  public owners: string[] = ["473858248353513472"];
  public version: string = "v9.5.5";
  public invites = new Collection();
  public autoplay: string[] = Array()
  public manager: Manager;
  public prefix: string = "!";
  public react: Map<string, Object> = new Map();
  public fetchforguild: Map<string, Object> = new Map();
  public userVotes: Record<string, number> = {};
  public i18n = i18n;
  public buttons: Record<string, (data: InteractionCreate) => void> = {};

  public get translate() {
    return this.i18n.__;
  }

  public constructor(options: ClientOptions = {}) {
    super({
      ...options,
      ws: { intents: Intents.ALL },
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
      messageCacheLifetime: 180,
      messageCacheMaxSize: 200,
      messageEditHistoryMaxSize: 200,
      messageSweepInterval: 180,
      restTimeOffset: 0,
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: true,
      cachePresences: true,
    });

    if (Bot.__instance__) throw new Error("Another client was created.");

    Bot.__instance__ = this;
  }

  public async start(config: Config): Promise<void> {
    this.logger.info("hi");
    this.config = config;

    /* mongodb & login */
    await Mongo();
    await this.login(config.token);

    /* start some useless shit that we probably  */
    Lottery(this);
    buttons(this);
    MainManager(this);

    /* start the api */
    let api = new API(this);
    api.start()

    /* load command files */
    const commandFiles: string[] = await globPromise(
        `${__dirname}/../commands/**/*{.ts,.js}`
    );

    commandFiles.map(async (value: string) => {
      const file: Command = await import(value);
      this.commands.set(file.name, {
        cooldown: 3000,
        description: "No description found.",
        category: "Miscellaneous",
        usage: `!${file.name}`,
        premiumOnly: false,
        devOnly: false,
        guildOnly: false,
        NSFW: false,
        voteRequired: false,
        ...file,
      });
      this.categories.add(file.category || "Miscellaneous");
      if (file.aliases?.length) {
        file.aliases.map((value: string) => this.aliases.set(value, file.name));
      }
    });

    const eventFiles: string[] = await globPromise(
        `${__dirname}/../events/**/*{.ts,.js}`
    );

    eventFiles.map(async (value: string) => {
      const file: Event = await import(value);
      this.events.set(file.name, file);
      this.on(file.name, file.run.bind(null, this));
    });
  }

  static get instance() {
    return Bot.__instance__;
  }
}

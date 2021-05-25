import { Logger } from "@dimensional-fun/logger";

import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";
import consola, { Consola } from "consola";
import { Client, Intents, Collection, ClientOptions } from "discord.js-light";
import glob from "glob";
import { promisify } from "util";
import { Config } from "../interfaces/Config";
import Constants from "../interfaces/Constants";
import Util from "../interfaces/Util";
import Mongo from "../interfaces/Database";
import EmbedConstruction from "../Classes/MainBotEmbed";
import Lottery from "../utils/Scheduled";
import { Manager } from "erela.js";
import { I18n } from "i18n";
import path from "path";

const i18n = new I18n({
  locales: ["en", "ro"],
  directory: path.join(__dirname, "../Locales"),
  objectNotation: true,
  defaultLocale: "en",
});

const globPromise = promisify(glob);

class Bot extends Client {
  private static __instance__?: Bot;

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
  public owners: string[] = ["396096412116320258", "473858248353513472", "508442553754845184"];
  public version: string = "v9.5.5";
  public invites = new Collection();
  public manager: Manager;
  public prefix: string = "!";
  public react: Map<string, Object> = new Map();
  public fetchforguild: Map<string, Object> = new Map();
  public userVotes: Record<string, number> = {};
  public i18n = i18n;

  public get translate() {
    return this.i18n.__;
  }

  public constructor(options: ClientOptions) {
    super(options);

    if (Bot.__instance__) throw new Error("Another client was created.");

    Bot.__instance__ = this;
  }

  public async start(config: Config): Promise<void> {
    this.logger.info("hi")
    Mongo();
    this.config = config;
    this.login(config.token);
    Lottery(this);

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

export { Bot };

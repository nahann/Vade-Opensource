import Koa from "koa";
import Body from "koa-body";
import { Consola } from "consola";

import { votes } from "./routers/votes";
import { main } from "./routers/main";

import type { Bot } from "../client/Client";

export class API {
  static PORT = 2000;

  readonly bot: Bot;

  koa: Koa;

  private log: Consola = new Consola({});

  constructor(bot: Bot) {
    this.bot = bot;
    this.koa = new Koa();
    this.koa.use(Body({ json: true }));
  }

  start() {
    this.koa.use(votes(this).middleware());
    this.koa.use(main().middleware());

    this.koa.listen(API.PORT, () =>
      this.log.info(`Now listening on port ${API.PORT}`)
    );
  }
}

import Router from "@koa/router";
import joi from "joi";
import voteSchema from "../../models/Users/voteStorage";

import type Koa from "koa";
import type { API } from "../API";

const topGG = joi.object<TopGG>({
  bot: joi.string().required(),
  user: joi.string().required(),
  type: joi.string().regex(/upvote|test/i),
  isWeekend: joi.boolean().required(),
  query: joi.string().optional(),
});

export function votes(api: API): Router {
  const router = new Router({ prefix: "/votes" });

  router.post("/top-gg", async (ctx: Koa.Context) => {
    const auth = ctx.header.authorization;
    if (!auth || auth !== api.bot.config.TOPGG_AUTH) {
      ctx.status = 401;
      ctx.body = { success: false, message: "incorrect authorization" };
      return;
    }

    const body: TopGG = ctx.request.body;
    try {
      await topGG.validate(body);
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errors: error.errors,
        message: error.message,
      };

      return;
    }



    api.bot.userVotes[body.user] = Date.now();
    const newSchema = new voteSchema({
      userID: body.user,
      date: Date.now()
    });

    await newSchema.save();
  });

  return router;
}

interface TopGG {
  bot: string;
  user: string;
  type: "upvote" | "test";
  isWeekend: boolean;
  query?: string;
}

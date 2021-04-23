import { Bot } from "../client/Client";

import { Message, PermissionString } from "discord.js";

export type RunFunction = (
  client: Bot,
  message: Message,
  args: string[]
) => Promise<unknown> | unknown;

export interface Command {
  name: string;
  category: string;
  aliases?: string[];
  cooldown: number;
  run: RunFunction;
  botPerms?: PermissionString[];
  userPerms?: PermissionString[];
  description?: string;
  usage?: string;
  premiumOnly?: boolean;
  modCommand?: boolean;
  adminCommand?: boolean;
  devOnly?: boolean;
  guildOnly?: boolean;
}

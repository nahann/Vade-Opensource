import { Collector, Collection, Message, Channel, Guild } from "discord.js";

declare class ButtonCollector extends Collector<any, any> {
  static key(button: object): string;
  constructor(message: Message, filter: any, options?: {});
  message: Message;
  users: Collection<any, any>;
  total: number;
  empty(): void;
  _handleChannelDeletion(channel: Channel): void;
  _handleGuildDeletion(guild: Guild): void;
  _handleMessageDeletion(message: Message): void;
}

export = ButtonCollector;

declare module "discord.js" {
  interface Message {
    createButtonCollector(filter: any, options?: { time?: number }): ButtonCollector;
    awaitButtons(filter: any, options?: {}): Promise<Array>;
  }
}

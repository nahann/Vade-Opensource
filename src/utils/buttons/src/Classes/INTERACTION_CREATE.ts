// @ts-nocheck

import { sendAPICallback } from "./APIMessage";
import WebhookClient from "./WebhookClient";

import type { Bot } from "../../../../client/Client"
import type { Guild, TextChannel, Message as DiscordMessage } from "discord.js";

const Message = require("./Message");

export default class ButtonEvent {
  client: Bot;
  id: string;
  version: number;
  token: string;
  discordID: string;
  applicationID: string;
  guild?: Guild;
  channel: TextChannel
  clicker: Record<string, any>;
  data: Record<string, any>;
  message: DiscordMessage;
  webhook: WebhookClient

  constructor(client: Bot, data: Record<string, any>) {
    this.client = client;

    this.id = data.data.custom_id;

    this.version = data.version;

    this.token = data.token;

    this.discordID = data.id;

    this.applicationID = data.application_id;

    this.guild = data.guild_id
      ? client.guilds.cache.get(data.guild_id)
      : undefined;

    this.channel = client.channels.cache.get(data.channel_id) as TextChannel;

    this.clicker = {
      user: this.client.users.resolve(data.guild_id ? data.member.user.id : data.user.id),
      member: this.guild ? this.guild.members.resolve(data.member.user.id) : undefined,
      fetch: async () => {
        this.clicker.user = this.client.users.resolve(data.guild_id ? data.member.user.id : data.user.id);
        if (this.guild) {
          this.clicker.member = await this.guild.members.fetch(data.member.user.id);
        }
        return true;
      }
    };

    if (this.guild) {
      this.clicker.member = this.guild.members.resolve(data.member.user.id);
      this.clicker.user = this.client.users.resolve(data.member.user.id);
    } else {
      this.clicker.user = this.client.users.resolve(data.user.id);
    }

    this.data = data;

    this.message = new Message(client, data.message, this.channel);

    this.webhook = new WebhookClient(
      data.application_id,
      data.token,
      client.options
    );

    this.replied = false;

    this.deferred = false;
  }

  async defer(ephemeral) {
    // if (this.deferred || this.replied)
      // throw new Error("BUTTON_ALREADY_REPLIED: This button already has a reply");

    await this.client.api
      .interactions(this.discordID, this.token)
      .callback.post({
        data: {
          type: 6,
          data: {
            flags: ephemeral ? 1 << 6 : null,
          },
        },
      });

    this.deferred = true;
  }

  async ack() {
    await this.client.api.interactions(this.discordID, this.token).callback.post({
      data: {
        type: 1
      }
    })
  }

  async think(ephemeral) {
    if (this.deferred || this.replied)
      throw new Error("BUTTON_ALREADY_REPLIED: This button already has a reply");

    await this.client.api
      .interactions(this.discordID, this.token)
      .callback.post({
        data: {
          type: 5,
          data: {
            flags: ephemeral ? 1 << 6 : null,
          },
        },
      });
    this.deferred = true;
  }

  get reply() {
    let _send = async (content, options = {}) => {
      if (this.deferred || this.replied)
        throw new Error(
          "BUTTON_ALREADY_REPLIED: This button already has a reply"
        );

      if (typeof options === "boolean" && options === true) {
        options = { flags: 1 << 6 };
      }

      let { data: info, files } = await (content instanceof sendAPICallback
        ? content
        : sendAPICallback.create(
            this.client.channels.resolve(this.channel.id),
            content,
            options || {}
          )
      ).resolveData();

      await this.client.api
        .interactions(this.discordID, this.token)
        .callback.post({
          data: {
            data: info,
            type: options.type
              ? [4, 5, 6, 7].includes(parseInt(options.type))
                ? parseInt(options.type)
                : 4
              : 4,
          },
          files,
        });
      this.replied = true;
    };

    let _fetch = async () => {
      const raw = await this.webhook.fetchMessage("@original");
      return this.channel ? this.channel.messages.add(raw) : raw;
    };

    let _edit = async (content, options = {}) => {
      if (this.deferred === false && this.replied === false)
        throw new Error("BUTTON_ALREADY_REPLIED: This button has no reply");
      const raw = await this.webhook.editMessage("@original", content, options);
      return this.channel ? this.channel.messages.add(raw) : raw;
    };

    let _delete = async () => {
      if (this.deferred === false && this.replied === false)
        throw new Error("BUTTON_ALREADY_REPLIED: This button has no reply");
      return await this.webhook.deleteMessage("@original");
    };

    return {
      send: _send,
      fetch: _fetch,
      edit: _edit,
      delete: _delete,
    };
  }
}

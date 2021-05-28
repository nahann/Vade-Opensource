const { Structures } = require("discord.js-light");
const ButtonCollector = require("./ButtonCollector");
const APIMessage = require("./APIMessage").APIMessageMain;

class Message extends Structures.get("Message") {
  createButtonCollector(filter, options = {}) {
    return new ButtonCollector(this, filter, options);
  }

  awaitButtons(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createButtonCollector(filter, options);
      collector.once("end", (buttons, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(buttons);
        } else {
          resolve(buttons);
        }
      });
    });
  }

  reply(content, options) {
    return this.channel.send(
      content instanceof APIMessage
        ? content
        : APIMessage.transformOptions(content, options, {
            reply: this.member || this.author,
          })
    );
  }

  async inlineReply(content, options) {
    const mentionRepliedUser =
      typeof ((options || content || {}).allowedMentions || {}).repliedUser ===
      "undefined"
        ? true
        : (options || content).allowedMentions.repliedUser;
    delete ((options || content || {}).allowedMentions || {}).repliedUser;

    const apiMessage =
      content instanceof APIMessage
        ? content.resolveData()
        : APIMessage.create(this.channel, content, options).resolveData();
    Object.assign(apiMessage.data, {
      message_reference: { message_id: this.id },
    });

    if (
      !apiMessage.data.allowed_mentions ||
      Object.keys(apiMessage.data.allowed_mentions).length === 0
    )
      apiMessage.data.allowed_mentions = {
        parse: ["users", "roles", "everyone"],
      };
    if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
      Object.assign(apiMessage.data.allowed_mentions, {
        replied_user: mentionRepliedUser,
      });

    if (Array.isArray(apiMessage.data.content)) {
      return Promise.all(
        apiMessage
          .split()
          .map((x) => {
            x.data.allowed_mentions = apiMessage.data.allowed_mentions;
            return x;
          })
          .map(this.inlineReply.bind(this))
      );
    }

  }

  edit(content, options) {
    const { data } =
      content instanceof APIMessage
        ? content.resolveData()
        : APIMessage.create(this, content, options).resolveData();
    return this.client.api.channels[this.channel.id].messages[this.id]
      .patch({ data })
      .then((d) => {
        const clone = this._clone();
        clone._patch(d);
        return clone;
      });
  }
}

module.exports = Message;

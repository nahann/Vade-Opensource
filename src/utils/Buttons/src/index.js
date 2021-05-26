const { Structures } = require("discord.js");
const Message = require("./Classes/Message");
const TextChannel = require("./Classes/TextChannel");
const DMChannel = require("./Classes/DMChannel");
const MessageButton = require("./Classes/MessageButton");
const INTERACTION_CREATE = require("./Classes/INTERACTION_CREATE.js");

module.exports = (client) => {
  Structures.extend("Message", () => Message);
  Structures.extend("TextChannel", () => TextChannel);
  Structures.extend("DMChannel", () => DMChannel);

  client.ws.on("INTERACTION_CREATE", async (data) => {
    if (!data.message) return;

    if (data.data.component_type === 2) {
      const button = new INTERACTION_CREATE(client, data);

      await client.emit("clickButton", button);
    }
  });

  return {
    MessageButton: MessageButton,
  };
};

module.exports.MessageButton = MessageButton;

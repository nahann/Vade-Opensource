import { Structures } from "discord.js";
import Message from "./Classes/Message";
import TextChannel from "./Classes/TextChannel";
import DMChannel from "./Classes/DMChannel";
import INTERACTION_CREATE from "./Classes/INTERACTION_CREATE";

import { MessageButton } from "./Classes/MessageButton"

export default (client) => {
  // @ts-expect-error 
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
}

export { MessageButton }

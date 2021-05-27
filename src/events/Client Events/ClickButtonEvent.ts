import { MessageButton } from "../../utils/buttons/src";

import type { RunFunction } from "../../interfaces/Event";
import type InteractionCreate from "../../utils/Buttons/typings/Classes/INTERACTION_CREATE";
import type { APIActionRowComponent } from "../../utils/Buttons/typings/Classes/MessageButton";

import type { APIPartialEmoji } from "discord-api-types";

export const run: RunFunction = async (client, button: InteractionCreate) => {
  if(button.deferred) return;
  if (button.replied) return;

  let disabledButton = new MessageButton()
    .setLabel("Used")
    .setDisabled()
    .setStyle("gray")
    .setID("disabled")

  let timeoutButton = new MessageButton()
    .setLabel("Timed out")
    .setDisabled()
    .setStyle("gray")
    .setID("disabled")

    //    button.message.edit({ buttons: [ disabledButton ] });

	/* invoke the button listener */
  client.buttons[button.id]?.(button);
	delete client.buttons[button.id];

  switch (button.id) {
    case "test": {
     const user = (await client.users.fetch(button.data.member.user.id));
     button.reply.send(`${user.tag} clicked the button!`, { ephemeral: true });
     button.message.edit({ buttons: [ disabledButton ] });
  }
  case "rpc": {

  }
}
};

declare module "discord.js" {
	interface MessageEditOptions {
		buttons?: MessageButton[];
		components?: APIActionRowComponent[];
	}
}

export const name: string = "clickButton";

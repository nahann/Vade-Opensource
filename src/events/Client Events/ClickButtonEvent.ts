import type { MessageButton } from "../../utils/buttons/src";
import type { RunFunction } from "../../interfaces/Event";
import type InteractionCreate from "../../utils/buttons/typings/Classes/INTERACTION_CREATE";
import type { APIActionRowComponent } from "../../utils/buttons/src/Classes/MessageButton";

export const run: RunFunction = async (client, button: InteractionCreate) => {
  if(button.deferred) return;
  if (button.replied) return;

    //    button.message.edit({ buttons: [ disabledButton ] });

	/* invoke the button listener */
  client.buttons[button.id]?.(button);
	delete client.buttons[button.id];

};

declare module "discord.js" {
	interface MessageEditOptions {
		buttons?: MessageButton[];
		components?: APIActionRowComponent[];
	}
}

export const name: string = "clickButton";

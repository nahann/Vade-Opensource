import { EventEmitter } from "events";
import InteractionCreate from "./INTERACTION_CREATE";

export = MessageButton;

/**
 * TODO: Include docs link
 */
 export interface APIBaseComponent {
	/**
	 * The type of the component
	 */
	type: ComponentType;
}

/**
 * TODO: Include docs link
 */
 export const enum ComponentType {
	/**
	 * ActionRow component
	 */
	ActionRow = 1,
	/**
	 * Button component
	 */
	Button,
}

/**
 * TODO: Include docs link
 */
export interface APIActionRowComponent extends APIBaseComponent {
	/**
	 * The type of the component
	 */
	type: ComponentType.ActionRow;
	/**
	 * The compponets in the ActionRow
	 */
	components: APIBaseComponent[];
}

/**
 * TODO: Include docs link
 */
export interface APIButtonComponent extends APIBaseComponent {
	/**
	 * The type of the component
	 */
	type: ComponentType.Button;
	/**
	 * The label to be displayed on the button
	 */
	label: string;
	/**
	 * The custom_id to be sent in the interaction when clicked
	 */
	custom_id: string;
	/**
	 * The style of the button
	 */
	style: ButtonStyle;
	/**
	 * The emoji to display to the left of the text
	 */
	emoji?: APIPartialEmoji;
	/**
	 * The URL to direct users to when clicked for Link buttons
	 */
	url?: string;
	/**
	 * The status of the button
	 */
	disabled?: boolean;
}

declare class MessageButton extends EventEmitter {
  constructor(data?: {});
  setup(data: object): MessageButton;
  style: string;
  label: string;
  disabled: boolean;
  url: string;
  custom_id: string;
  type: number;

  setStyle(style: ButtonStyle): MessageButton;

  setLabel(label: string): MessageButton;

  setDisabled(boolean: boolean): MessageButton;

  setURL(url: string): MessageButton;

  setID(id: string): MessageButton;

  /**
   * Whether this button has a timeout
   * 
   * @param duration Timeout duration
   * @param seconds Whether the supplied duration is in seconds.
   */
  setTimeout(duration: number, seconds?: Boolean): MessageButton;

  toJSON(): {
    type: number;
    style: string;
    label: string;
    disabled: boolean;
    url: string;
    custom_id: string;
  };

  on(event: "click", listener: (data: InteractionCreate) => void): void;
}

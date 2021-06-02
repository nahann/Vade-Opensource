import { resolveStyle, isEmoji } from "../Util";
import { Util } from "discord.js";
import { EventEmitter } from "events";

import type ButtonEvent from "./INTERACTION_CREATE";

import type { APIPartialEmoji } from "discord-api-types";

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


/**
 * TODO: Include docs link
 */
 export const enum ButtonStyle {
	Primary = 1,
	Secondary,
	Success,
	Danger,
	Link
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

export class MessageButton extends EventEmitter implements APIButtonComponent {
	type: ComponentType.Button;
	label: string;
	custom_id: string;
	style: ButtonStyle;
	emoji?: APIPartialEmoji;
	url?: string;
	disabled?: boolean;

  /**
   * The timeout of this but
   */
  timeout: number;

  /**
   * 
   */
  private _timeout: NodeJS.Timeout;

  /**
   * 
   */
  constructor(data?: APIButtonComponent) {
    super()
    // @ts-expect-error
    this.setup(data ?? {});
  }

  /** 
   * 
   */
  setup(data: APIButtonComponent) {
    this.style = "style" in data 
      ? resolveStyle(Util.resolveString(data.style)) 
      : null;

    this.label = "label" in data 
      ? Util.resolveString(data.label) 
      : null;

    this.disabled = "disabled" in data 
      ? Boolean(data.disabled) 
      : false;

    if (this.style === 5) {
      this.url = "url" in data ? Util.resolveString(data.url) : null;
    } else {
      // @ts-expect-error
      this.custom_id = "id" in data ? Util.resolveString(data.id) : null;
    }

    this.type = 2;
    return this;
  }

  /**
   * 
   */
  setEmoji(emojiName, emojiId: `${bigint}` | null = null) {
    emojiName = Util.resolveString(emojiName);

    if(isEmoji(emojiName)) this.emoji = { name: emojiName, id: null }
    else if(emojiId.length > 0) this.emoji = { name: emojiName, id: emojiId }
    else this.emoji = { name: null, id: null };
    return this;
  }

  /**
   * 
   */
  setStyle(style: ButtonStyle) {
    this.style = style;
    return this;
  }

  /**
   * 
   */
  setLabel(label) {
    label = Util.resolveString(label);
    this.label = label;
    return this;
  }

  /**
   * Sets the disabled state for this button.
   */
  setDisabled(boolean: boolean = true) {
    this.disabled = boolean ?? false
    return this;
  }

  /**
   * 
   */
  setURL(url: string): MessageButton {
    this.url = this.style === 5 ? Util.resolveString(url) : null;
    return this;
  }

  /**
   * 
   */
  setID(id: string): MessageButton {
    this.custom_id = this.style === 5 ? null : Util.resolveString(id);
    return this;
  }

  /**
   * 
   */
  setTimeout(duration: number, seconds: boolean = true): MessageButton {
    this.timeout = seconds ? duration * 1000 : duration;
    return this;
  }

  /** 
   * Start the timeout.
   */
  startTimeout() {
    this._timeout = setTimeout(() => {
      this.emit("timed-out");
      delete this._timeout;
    }, this.timeout);
  }

  /**
   * 
   */
  toJSON() {
    return {
      type: 2,
      style: this.style,
      label: this.label,
      emoji: this.emoji,
      disabled: this.disabled,
      url: this.url,
      custom_id: this.custom_id,
    };
  }
}

export interface MessageButton extends EventEmitter, APIButtonComponent {
  on(event: "click", listener: (data: ButtonEvent) => void): this;
  on(event: "timed-out", listener: () => void): this;
}

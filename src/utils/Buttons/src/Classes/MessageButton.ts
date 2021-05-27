const { resolveStyle } = require("../Util");
const { resolveString } = require("discord.js").Util;
const { EventEmitter } = require("events");

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

class MessageButton extends EventEmitter {
  constructor(data = {}) {
    super()
    this.setup(data);
  }

  setup(data) {
    this.style =
      "style" in data ? resolveStyle(resolveString(data.style)) : null;

    this.label = "label" in data ? resolveString(data.label) : null;

    this.disabled = "disabled" in data ? Boolean(data.disabled) : false;

    if (this.style === 5) {
      this.url = "url" in data ? resolveString(data.url) : null;
    } else {
      this.custom_id = "id" in data ? resolveString(data.id) : null;
    }

    this.type = 2;

    return this;
  }

  setStyle(style) {
    style = resolveStyle(resolveString(style));
    this.style = style;
    return this;
  }

  setLabel(label) {
    label = resolveString(label);
    this.label = label;
    return this;
  }

  setDisabled(boolean) {
    this.disabled = Boolean(boolean || true);
    return this;
  }

  setURL(url) {
    this.url = this.style === 5 ? resolveString(url) : null;
    return this;
  }

  setID(id) {
    this.custom_id = this.style === 5 ? null : resolveString(id);
    return this;
  }

  setTimeout(duration, seconds = true) {
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

  toJSON() {
    return {
      type: 2,
      style: this.style,
      label: this.label,
      disabled: this.disabled,
      url: this.url,
      custom_id: this.custom_id,
    };
  }
}

module.exports = MessageButton;
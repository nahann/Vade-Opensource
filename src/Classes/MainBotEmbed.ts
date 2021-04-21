import config from "../interfaces/Constants";
import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export default class EmbedHandler extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
    this.setMainColor();
  }

  setMainColor() {
    return this.setColor("#00f2ff");
  }

  setSuccessColor() {
    return this.setColor(config.colours.green);
  }

  setErrorColor() {
    return this.setColor(config.colours.red_dark);
  }

  setWarningColor() {
    return this.setColor("#d7e825");
  }

  setBlankField() {
    return this.addField("\u200b", "\u200b");
  }
}

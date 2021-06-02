import config from "../interfaces/Constants";

import { Guild, MessageEmbed, MessageEmbedOptions } from "discord.js";

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

  setClear() {
    return this.setColor("#2f3136");
  }

  setIcon(guild: Guild): EmbedHandler {
    if (!guild) {
      throw new TypeError(`No guild provided.`);
    }

    if (!guild.iconURL()) {
      return this.setThumbnail(guild.client.user.displayAvatarURL());
    } else {
      return this.setThumbnail(guild.iconURL());
    }
  }
}

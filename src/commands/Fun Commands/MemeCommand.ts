import { RunFunction } from "../../interfaces/Command";
import * as api from "imageapi.js";

export const run: RunFunction = async (client, message, args) => {
  const meme = await api.advanced("meme", "top");
  message.channel.send(
    new client.embed()
      .setTitle(meme.title)
      .setDescription(
        `${meme.upvoteRatio}% of people liked this meme. :thumbsup: ${meme.upvotes} :thumbsdown: ${meme.downvotes}`
      )
      .setImage(meme.img)
      .setMainColor()
  );
};

export const name: string = "meme";
export const category: string = "Fun";
export const cooldown: number = 5000;

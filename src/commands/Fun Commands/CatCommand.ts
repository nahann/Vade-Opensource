import { RunFunction } from "../../interfaces/Command";
import fetch from "node-fetch";

export const run: RunFunction = async (client, message, args) => {
  try {
    const catData = await fetch(
      "https://api.thecatapi.com/v1/images/search"
    ).then((response) => response.json());
    const catImage = catData[0].url;

    const embed = new client.embed().setImage(catImage).setClear();

    message.channel.send(embed);
  } catch (err) {
    console.log(err);
    return message.channel.send(
      `Looks as if an error has occured. Try again later.`
    );
  }
};
export const name: string = "cat";
export const category: string = "Fun";
export const description: string = "Recieve an image of a Cat.";
export const aliases: string[] = ["kitten"];

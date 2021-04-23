import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const method = args[0];
  if (
    !method ||
    (method.toLowerCase() !== "encode" && method.toLowerCase() !== "decode")
  )
    return message.channel.send(
      `You need to specify either \`encode\` or \`decode\`.`
    );
  const text = args.slice(1).join(" ");
  if (!text)
    return message.channel.send(
      `You need to specify some text to encode/decode.`
    );

  if (method == "encode") {
    let base64en = new client.embed()
      .setColor(`DARK_BLUE`)
      .setDescription(Buffer.from(text).toString("base64"));
    message.channel.send(base64en);
  } else if (method == "decode") {
    let base64dec = new client.embed()
      .setColor(`DARK_BLUE`)
      .setDescription(Buffer.from(text, "base64").toString("ascii"));
    message.channel.send(base64dec);
  }
};

export const name: string = "base64";
export const category: string = "Utility";
export const usage: string = "!base64 <Text to encode>.";
export const premiumOnly: boolean = true;

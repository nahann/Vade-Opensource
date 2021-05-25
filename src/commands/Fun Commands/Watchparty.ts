import { RunFunction } from "../../interfaces/Command";
import { DiscordTogether } from "../../utils/discord-together/index";

export const run: RunFunction = async (client, message, args) => {
  const available: Array<string> = ["poker", "fishing", "youtube", "betrayal"];
  // const discordTogether = new DiscordTogether(client, {
    // token: client.config.token,
  // });

  // if (!args[0] || !available.includes(args[0]?.toLowerCase()))
    // return message.channel.send(
      // `You must select one of the following:\n\n ${available.join("\n")}`
    // );

  // discordTogether
    // .createTogetherCode(message.member.voice.channelID, args[0]?.toLowerCase())
    // .then(async (invite) => {
      // return message.channel.send(`[LINK](${invite.code})`);
    // });
};
export const name: string = "watchparty";
export const category: string = "Fun";
export const description: string = "Big boi test";
export const aliases: string[] = ["test"];

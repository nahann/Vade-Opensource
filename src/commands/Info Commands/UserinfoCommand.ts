import { GuildMember } from "discord.js";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const member: GuildMember = await client.utils.getMember(
    message,
    args[0],
    true
  );
  if (!member) return;
};

export const name: string = "userinfo";
export const category: string = "info";
export const usage: string = "!userinfo <User name, ID or tag>.";
export const description: string = "View information on another Guild Member.";

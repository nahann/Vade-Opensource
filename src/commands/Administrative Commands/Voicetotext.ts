import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {};
export const name: string = "voicetotext";
export const category: string = "Administrative";
export const description: string =
  "Bind a Text Channel to a Voice Channel so that it is only visible upon joining the VC.";
export const aliases: string[] = ["vtl"];
export const botPerms: string[] = ["MANAGE_ROLES", "MANAGE_CHANNELS"];
export const userPerms: string[] = ["MANAGE_ROLES", "MANAGE_CHANNELS"];

import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {};

export const name: string = "accept";
export const category: string = "suggestion";
export const botPerms: string[] = ["MANAGE_MESSAGES"];
export const userPerms: string[] = ["MANAGE_GUILD"];

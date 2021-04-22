import { RunFunction } from "../../interfaces/Command";
import { GuildMember } from "discord.js";

const options: {
  [flag: string]: {
    alias: string;
    message: string;
  };
} = {
  "--name": {
    alias: "-n",
    message: "Kicks all users whose name has the specified word in",
  },
  "--regex": {
    alias: "-r",
    message: "Kicks all users whose name match the regex",
  },
  "--silent": {
    alias: "-s",
    message: "Kicks users silently; does not DM them or displays output",
  },
  "--soft": {
    alias: "-S",
    message: "Kicks users and clears their messages",
  },
  "--hard": {
    alias: "-H",
    message: "Kicks users and appends your custom message to the DM",
  },
  "--help": {
    alias: "-h",
    message: "Displays this nice little help message",
  },
  "--dev": {
    alias: "-d",
    message: "For testing purposes; does not kick",
  },
};

export const run: RunFunction = async (client, message, args) => {

};

export const name: string = "ban";
export const category: string = "Moderation";
export const usage: string = "!ban <user(s)> <Optional flags>.";
export const botPerms: string[] = ["BAN_MEMBERS", "MANAGE_CHANNEL"];
export const userPerms: string[] = ["BAN_MEMBERS"];
export const modCommand: boolean = true;

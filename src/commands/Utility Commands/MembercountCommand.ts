import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  let embed = new client.embed()
    .setTitle(`${message.guild.name}'s member count`)
    .setDescription(`Members: **${message.guild.memberCount}**`)
    .setClear()
    .setTimestamp()
    .setThumbnail(message.guild.iconURL());

  return message.channel.send(embed);
};
export const name: string = "membercount";
export const category: string = "Utility";
export const description: string = "View the Servers member count!";
export const aliases: string[] = ["memberc"];

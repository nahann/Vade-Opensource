import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const member = await client.utils.getMember(message, args[0], true);
  if (!member) return;

  const u = member.id !== message.author.id ? member.user : message.author;

  return message.channel.send(
    new client.embed()
      .setTitle(u.username)
      .setImage(u.displayAvatarURL({ dynamic: true, size: 512 }))
  );
};
export const name: string = "avatar";
export const category: string = "Fun";
export const description: string = "Display the specified users Avatar.";
export const aliases: string[] = ["av"];

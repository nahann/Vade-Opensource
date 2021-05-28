import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const event = args.join(" ");
  if (!event) return message.channel.send(`No Event specified.`);

  switch (event) {
    case "guildMemberAdd": {
      client.emit("guildMemberAdd", message.member);
      message.channel.send(`Emitting....`);
      break;
    }
    case "guildMemberRemove": {
      client.emit("guildMemberRemove", message.member);
      message.channel.send(`Emitting....`);
      break;
    }
    case "guildCreate": {
      client.emit("guildCreate", message.guild);
      message.channel.send(`Emitting....`);
      break;
    }
  }
};
export const name: string = "emit";
export const category: string = "Development";
export const description: string = "Emit a Client Event; for testing purposes.";
export const aliases: string[] = ["sim", "simulate"];
export const devOnly: boolean = true;

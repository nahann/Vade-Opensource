import { RunFunction } from "../../interfaces/Command";
import Schema from "../../models/blacklist";

export const run: RunFunction = async (client, message, args) => {
  switch (args[0]) {
    case "add": {
      const reason = args.slice(2).join(" ") ?? "No reason provided.";

      const member = await client.utils.getMember(message, args[1], true);
      if (!member) return;
    }

    case "remove": {
    }

    default: {
      const locateAll = await Schema.find({});
      if (!locateAll.length)
        return client.utils.sendError(
          `Nobody is currently Blacklisted from the Bot.`,
          message.channel
        );

      const listEmbed = new client.embed()
        .setTitle(`Vade Blacklist`)
        .setDescription(
          `${locateAll
            .filter((x) => x.Active)
            .map(async (x) => `${(await client.users.fetch(x.User)).tag}`)}`
        );
    }
  }
};
export const name: string = "blacklist";
export const category: string = "Developer";
export const description: string =
  "View the full blacklist, add a blacklist or remove a blacklist.";
export const aliases: string[] = ["botban"];

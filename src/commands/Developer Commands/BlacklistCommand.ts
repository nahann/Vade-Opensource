import { RunFunction } from "../../interfaces/Command";
import Schema from "../../models/blacklist";

export const run: RunFunction = async (client, message, args) => {
  switch (args[0]) {
    case "add": {
        if(!client.utils.checkOwner(message.author.id)) return client.utils.sendError(`This sub command requires you to be a Vade Developer.`, message.channel);

      const reason = args.slice(2).join(" ") ?? "No reason provided.";

      const member = await client.utils.getMember(message, args[1], true);
      if (!member) return;
      const check = await Schema.findOne({ User: member.id });
      if(check) return client.utils.sendError(`That user is already Blacklisted!`, message.channel);
      const newBlacklist = new Schema({
          User: member.id,
          Reason: reason,
          Active: true,
      });
      await newBlacklist.save();
      return client.utils.succEmbed(`Successfully added ${member.user.tag} to the global Blacklist!`, message.channel);
    }

    case "remove": {

        if(!client.utils.checkOwner(message.author.id)) return client.utils.sendError(`This sub command requires you to be a Vade Developer.`, message.channel);
        const member = await client.utils.getMember(message, args[1], true);
        if (!member) return;
        const check = await Schema.findOne({ User: member.id });
        if(!check) return client.utils.sendError(`That user isn't actually Blacklisted.`, message.channel);
        await check.delete();
        return client.utils.succEmbed(`Successfully removed that users Blacklist.`, message.channel);

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
            .map(async (x) => `**__${(await client.users.fetch(x.User)).tag}__**\nReason: ${x.Reason ?? 'No reason provided.'}`).join("\n\n")}`
        );

        return message.channel.send(listEmbed);
    }
  }
};
export const name: string = "blacklist";
export const category: string = "Developer";
export const description: string =
  "View the full blacklist, add a blacklist or remove a blacklist.";
export const aliases: string[] = ["botban"];

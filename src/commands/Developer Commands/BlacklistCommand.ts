import { RunFunction } from "../../interfaces/Command";
import Schema from "../../models/blacklist";
import profileSchema from "../../models/profile";

export const run: RunFunction = async (client, message, args) => {
  switch (args[0]) {
    case "add": {
      if (!client.utils.checkOwner(message.author.id))
        return client.utils.sendError(
          `This sub command requires you to be a Vade Developer.`,
          message.channel
        );

      const reason = args.slice(2).join(" ").length
        ? args.slice(2).join(" ")
        : "No reason provided.";

      const member = await client.utils.getMember(message, args[1], true);
      if (!member) return;
      const check = await Schema.findOne({ User: member.id });
      if (check)
        return client.utils.sendError(
          `That user is already Blacklisted!`,
          message.channel
        );
      const newBlacklist = new Schema({
        User: member.id,
        Reason: reason,
        Active: true,
      });
      await newBlacklist.save();

      const profileCheck = await profileSchema.findOne({ User: member.id });
      if (profileCheck) {
        await profileCheck.updateOne({
          Blacklisted: true,
          Wallet: 0,
          Bank: 0,
        });
      } else {
        const newProf = new profileSchema({
          User: member.id,
          Blacklisted: true,
        });

        await newProf.save();
      }
      return client.utils.succEmbed(
        `Successfully added ${member.user.tag} to the global Blacklist!`,
        message.channel
      );
    }

    case "remove": {
      if (!client.utils.checkOwner(message.author.id))
        return client.utils.sendError(
          `This sub command requires you to be a Vade Developer.`,
          message.channel
        );
      const member = await client.utils.getMember(message, args[1], true);
      if (!member) return;
      const check = await Schema.findOne({ User: member.id });
      if (!check)
        return client.utils.sendError(
          `That user isn't actually Blacklisted.`,
          message.channel
        );
      await check.delete();
      const profileCheck = await profileSchema.findOne({ User: member.id });
      if (profileCheck) {
        await profileCheck.updateOne({
          Blacklisted: false,
        });
      }
      return client.utils.succEmbed(
        `Successfully removed that users Blacklist.`,
        message.channel
      );
    }

    default: {
      const locateAll = await Schema.find({});
      if (!locateAll.length)
        return client.utils.sendError(
          `Nobody is currently Blacklisted from the Bot.`,
          message.channel
        );

      const mapped = await Promise.all(
        locateAll.map(
          async (x) =>
            `**__${(await client.users.fetch(x.User)).tag}__**\n${x.Reason}\n`
        )
      );

      const listEmbed = new client.embed()
        .setTitle(`Vade Blacklist`)
        .setDescription(mapped)
        .setClear()
        .setTimestamp()
        .setFooter(`Vade Blacklist`, client.user.displayAvatarURL());

      return message.channel.send(listEmbed);
    }
  }
};
export const name: string = "blacklist";
export const category: string = "Development";
export const description: string =
  "View the full blacklist, add a blacklist or remove a blacklist.";
export const aliases: string[] = ["botban"];

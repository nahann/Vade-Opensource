import { RunFunction } from "../../interfaces/Command";
import MainSchema from "../../../src/models/GuildConfig/scheduleRoles";

export const run: RunFunction = async (client, message, args) => {
  const findRoles = await MainSchema.findOne({ guildID: message.guild.id });

  if (!args.length) {
    let embed = new client.embed()
      .setClear()
      .setTimestamp()
      .setAuthor(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setDescription(
        findRoles && findRoles?.roleArray.length
          ? `${findRoles.roleArray.map((role) => `<@&${role}>`).join(", ")}`
          : `This server has no scheduled roles configured.`
      );

    return message.channel.send(embed);
  }

  switch (args[0]?.toLowerCase()) {
    case "add": {
      if (findRoles?.roleArray.length >= 3)
        return client.utils.sendError(
          `You can only have a maximum of 3 scheduled roles configured for each server. Please remove one to add another.`,
          message.channel
        );

      if (!args[1])
        return client.utils.sendError(
          `You need to specify the role name, ID or mention.`,
          message.channel
        );
      const role = client.utils.getRoles(args[1], message.guild);
      if (!role)
        return client.utils.sendError(
          `Unable to locate that role. Please try again.`,
          message.channel
        );
      if (role.position > message.guild.me.roles.highest.position)
        return client.utils.sendError(
          `That roles position is too high for the Bot to add. Please fix this.`,
          message.channel
        );
      if (findRoles) {
        await findRoles.updateOne({
          $push: { roleArray: role.id },
        });

        return client.utils.succEmbed(
          `Successfully added ${role} as a scheduled role for this server!`,
          message.channel
        );
      } else {
        const newSchema = new MainSchema({
          guildID: message.guild.id,
          roleArray: role.id,
        });

        await newSchema.save();

        return client.utils.succEmbed(
          `Successfully added ${role} as a scheduled role for this server!`,
          message.channel
        );
      }
    }

    case "remove": {
      if (
        !findRoles ||
        !findRoles?.roleArray.length ||
        findRoles?.roleArray.length < 1
      )
        return client.utils.sendError(
          `You have no scheduled roles to remove.`,
          message.channel
        );

      if (!args[1])
        return client.utils.sendError(
          `You need to specify the role.`,
          message.channel
        );
      const role = client.utils.getRoles(args[1], message.guild);
      if (!role)
        return client.utils.sendError(
          `Unable to locate that role! Please try again!`,
          message.channel
        );
      const roleArray = findRoles.roleArray;
      if (!roleArray.includes(role.id))
        return client.utils.sendError(
          `Unable to find a scheduled role with the name "${role.name}" and the ID "${role.id}"`,
          message.channel
        );
      await findRoles.updateOne({
        $pull: { roleArray: role.id },
      });

      return client.utils.succEmbed(
        `Successfully removed "${role.name}" from this servers scheduled roles!`,
        message.channel
      );
    }

    default:
      return client.utils.sendError(
        `You need to specify either \`add\` or \`remove\`.`,
        message.channel
      );
  }
};
export const name: string = "schedulerole";
export const category: string = "Administrative";
export const description: string =
  "Schedule a role to be given on a Friday and removed on a Monday.";
export const userPerms: string[] = ["MANAGE_GUILD"];
export const botPerms: string[] = ["MANAGE_ROLES", "MANAGE_GUILD"];

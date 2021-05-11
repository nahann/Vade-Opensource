import { RunFunction } from "../../interfaces/Command";
import guild_schema from "../../models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  if (message.channel.type !== "text") return;

  const locate_schema = await guild_schema.findOne({
    guildID: message.guild.id,
  });
  if (!locate_schema)
    return message.channel.send(
      `Looks as if there's been an error locating your Servers data, please contact a Developer.`
    );

  switch (args[0]?.toLowerCase()) {
    case "list": {
      const current = locate_schema.AdminRole;
      let roleList = [];
      if (current?.length) {
        roleList = current
          .filter((role) => message.guild.roles.cache.get(role))
          .map((role) => `<@&${role}>`);
      }
      let roleEmbed = new client.embed()
        .setMainColor()
        .setTitle("📌 Administrator Roles")
        .setDescription(
          `Administrator Roles: ${
            roleList?.length ? roleList.join(" ") : "**None**"
          }`
        )
        .setFooter(`Vade Moderation`, client.user.displayAvatarURL())
        .setTimestamp();
      return message.channel.send(roleEmbed);
    }

    case "remove": {
      if (!locate_schema.AdminRole.length)
        return message.channel.send(
          `There are currently no Administrator Roles setup for this Server!`
        );

      if (!args[1])
        return message.channel.send(
          `Please mention a valid role name, ID or mention.`
        );
      const role = client.utils.getRoles(args[1], message.guild);
      if (!role)
        return message.channel.send(
          `Please mention a valid role name, ID or mention.`
        );
      let roleID = role.id;

      if (!locate_schema.AdminRole.includes(roleID))
        return client.utils.sendError(
          `The Role: ${role} is currently not set as a Administrator role for this Server!`,
          message.channel
        );

      await locate_schema.updateOne({
        $pull: { AdminRole: roleID },
      });

      return client.utils.succEmbed(
        `Successfully removed ${role} from the Administrator Roles in this Server!`,
        message.channel
      );
    }

    case "add": {
      if (!args[1])
        return message.channel.send(
          `Please mention a valid role name, ID or mention.`
        );
      const role = client.utils.getRoles(args[1], message.guild);
      if (!role)
        return message.channel.send(
          `Please mention a valid role name, ID or mention.`
        );
      if (locate_schema.AdminRole && locate_schema.AdminRole?.length >= 5)
        return message.channel.send(
          `You cannot have more than 5 Administrator Roles setup for one Server.`
        );

      await locate_schema.updateOne({
        $push: { AdminRole: role.id },
      });

      return client.utils.succEmbed(
        `Successfully set ${role} as a Administrator Role!`,
        message.channel
      );
    }

    default:
      return message.channel.send(
        `Please specify either \`add\`, \`remove\` or \`list\`.`
      );
  }
};
export const name: string = "adminrole";
export const category: string = "Administrative";
export const description: string = "Configure the guilds administrator role.";
export const aliases: string[] = ["arole"];
export const userPerms: string[] = ["MANAGE_GUILD"];

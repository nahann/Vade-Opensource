import { RunFunction } from "../../interfaces/Command";
import autoroleSchema from "../../models/autoroles";

export const run: RunFunction = async (client, message, args) => {
  let embed = new client.embed().setMainColor();

  let fetchList = await autoroleSchema.findOne({
    guildID: message.guild.id,
  });

  let roleList = [];
  if (fetchList) {
    roleList = fetchList.roles.map((role) => `<@&${role}>`);
  }

  if (!args.length) {
    embed
      .setTitle(`📃 List of auto assigned roles`)
      .setDescription(`${roleList.length ? roleList.join(`, `) : "**None**"}`)
      .setFooter(
        `${fetchList?.enabled ? "Enabled" : "Disabled"}`,
        message.guild.iconURL()
      )
      .setTimestamp();
    return message.channel.send(embed);
  }

  if (!args[1]) {
    switch (args[0].toLowerCase()) {
      case "disable":
      case "enable": {
        if (!fetchList)
          return message.channel.send(
            "This server does not have autorole setup!"
          );

        if (!fetchList.enabled && args[0] === "disable") {
          return message.channel.send(
            "This server has already disabled autorole!"
          );
        }
        if (fetchList.enabled && args[0] === "enable") {
          return message.channel.send(
            "This server has already enabled autorole!"
          );
        }

        await autoroleSchema.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            $set: {
              enabled: !fetchList.enabled,
            },
          }
        );
        return message.channel.send(
          `The autorole system has successfully been ${
            args[0] === "disable" ? "DISABLED" : "ENABLED"
          } for this Server.`
        );
      }

      default:
        return message.channel.send(
          `That is not a valid option. Valid options: \`add\`, \`remove\`, \`enable\` and \`disable\`.`
        );
    }
  }

  const findRole = client.utils.getRoles(args[1], message.guild);
  if (!findRole)
    return message.channel.send(
      `Please specify a valid role. You can mention a role or specify the ID/name.`
    );
  const roleID = findRole.id;
  if (findRole.position > message.guild.me.roles.highest.position)
    return message.channel.send(
      `You cannot have a role higher than my highest role as an autorole.`
    );

  let newList;
  switch (args[0].toLowerCase()) {
    case "add": {
      if (!fetchList) {
        const data = new autoroleSchema({
          guildID: message.guild.id,
          roles: roleID,
          enabled: true,
        });

        await data.save();
      } else {
        newList = await autoroleSchema.findOne({
          guildID: message.guild.id,
          roles: roleID,
        });
        if (newList)
          return message.channel.send(
            `That role is already configured as an autorole for this Server.`
          );

        await autoroleSchema.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            $push: {
              roles: roleID,
            },
          }
        );
      }

      return message.channel.send(
        `The Role: **${findRole.name}** has successfully been configured as an autorole.`
      );
    }

    case "remove": {
      if (!fetchList)
        return message.channel.send(
          `This Server does not have any autoroles configured.`
        );

      newList = await autoroleSchema.findOne({
        guildID: message.guild.id,
        roles: roleID,
      });
      if (!newList)
        return message.channel.send(
          `Could not locate an autorole setup for that role!`
        );

      await autoroleSchema.findOneAndUpdate(
        {
          guildID: message.guild.id,
        },
        {
          $pull: {
            roles: roleID,
          },
        }
      );

      return message.channel.send(
        `That role has successfully been removed from the servers configured autoroles.`
      );
    }
  }
};
export const name: string = "autoroles";
export const category: string = "Administrative";
export const description: string = "Configure the Guilds autoroles.";
export const aliases: string[] = ["autorole"];
export const cooldown: number = 5000;
export const userPerms: string[] = ["MANAGE_ROLES"];
export const botPerms: string[] = ["MANAGE_ROLES"];

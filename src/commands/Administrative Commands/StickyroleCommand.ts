import { RunFunction } from "../../interfaces/Command";
import stickyroleSchema from "../../../models/GuildConfig/stickyroles";

export const run: RunFunction = async (client, message, args) => {
  if (message.channel.type !== "text") return;

  const sendError = client.utils.sendError;
  const succEmbed = client.utils.succEmbed;
  const prefix = await client.utils.resolvePrefix(message.guild.id);

  let fetchList = await stickyroleSchema.findOne({
    guildID: message.guild.id,
  });

  if (!fetchList && !args.length)
    return sendError(
      `Sticky role has not been initialized on the server\nPlease use \`${prefix}stickyrole toggle\` to enable the feature`,
      message.channel
    );

  const findRole = message.channel.guild.roles.cache;

  if (!args.length) {
    let roleList = [];
    if (fetchList.blacklist.length) {
      roleList = fetchList.blacklist
        .filter((role) => findRole.get(role))
        .map((role) => `<@&${role}>`);
    }

    console.log(roleList);
    let embed = new client.embed()
      .setMainColor()
      .setTitle("📌 Sticky Roles")
      .setDescription(
        `Blacklisted Roles: ${
          roleList?.length ? roleList.join(" ") : "**None**"
        }`
      )
      .setFooter(
        fetchList.enabled ? "Enabled" : "Disabled",
        message.guild.iconURL()
      )
      .setTimestamp();
    return message.channel.send(embed);
  }

  let newList;
  let roleID;
  if (args[1]) {
    const role = client.utils.getRoles(args[1], message.guild);
    if (!role) return sendError("Please mention a valid role", message.channel);
    const roleID = role.id;
    newList = await stickyroleSchema.findOne({
      guildID: message.guild.id,
      blacklist: role.id,
    });
  }

  switch (args[0].toLowerCase()) {
    case "toggle":
      if (!fetchList) {
        const data = new stickyroleSchema({
          guildname: message.guild.name,
          guildID: message.guild.id,
          roles: [],
          blacklist: [],
          enabled: true,
        });
        data.save().catch((e) => console.error(e));
        succEmbed(
          `Sticky role has been **ENABLED** on the server!`,
          message.channel
        );
      } else {
        try {
          await stickyroleSchema.findOneAndUpdate(
            {
              guildID: message.guild.id,
            },
            {
              $set: {
                enabled: !fetchList.enabled,
              },
            }
          );
        } catch (e) {
          console.error(e);
        }
        succEmbed(
          `Sticky role has been **${
            !fetchList.enabled === true ? "ENABLED" : "DISABLED"
          }** on the server!`,
          message.channel
        );
      }
      break;
    case "blacklist":
      if (!roleID)
        return sendError("Please mention a valid role", message.channel);
      if (newList)
        return sendError(
          `${findRole.get(roleID)} has already been blacklisted!`,
          message.channel
        );

      try {
        await stickyroleSchema.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            $push: {
              blacklist: roleID,
            },
          }
        );
      } catch (e) {
        console.error(e);
      }
      succEmbed(
        `${findRole.get(roleID)} has been added to the blacklist!`,
        message.channel
      );
      break;

    case "remove":
      if (!roleID)
        return sendError("Please mention a valid role", message.channel);
      if (!newList)
        return sendError(
          `${findRole.get(roleID)} was not found in the database!`,
          message.channel
        );
      try {
        await stickyroleSchema.findOneAndUpdate(
          {
            guildID: message.guild.id,
          },
          {
            $pull: {
              blacklist: roleID,
            },
          }
        );
      } catch (e) {
        console.error(e);
      }
      succEmbed(
        `${findRole.get(roleID)} has been removed from the blacklist!`,
        message.channel
      );
      break;
    default:
      return sendError(
        `Please enter a valid option\n\n**Valid options:** \`toggle\`, \`blacklist\`, and \`remove\``,
        message.channel
      );
  }
};
export const name: string = "stickyrole";
export const category: string = "Administrative";
export const description: string =
  "Enable sticky roles on this Server. Anyone that leaves, their roles will be remember for the next time they join. Blacklisted roles will not be added.";
export const aliases: string[] = ["srole"];
export const userPerms: string[] = ['MANAGE_GUILD'];
export const botPerms: string[] = ['MANAGE_ROLES'];

import { RunFunction } from "../../interfaces/Command";
import guild_schema from "../../../models/GuildConfig/guild";

export const run: RunFunction = async (client, message, args) => {
  if(message.channel.type !== 'text') return;


  const locate_schema = await guild_schema.findOne({ guildID: message.guild.id });
  if(!locate_schema) return message.channel.send(`Looks as if there's been an error locating your Servers data, please contact a Developer.`);


  switch(args[0]?.toLowerCase()) {

    case "list": {

      const current = locate_schema.ModRole;
      let roleList = [];
      if (current?.length) {
        roleList = current
          .filter((role) => message.guild.roles.cache.get(role))
          .map((role) => `<@&${role}>`);
      }
      let roleEmbed = new client.embed()
      .setMainColor()
      .setTitle("📌 Moderator Roles")
      .setDescription(
        `Moderator Roles: ${
          roleList?.length ? roleList.join(" ") : "**None**"
        }`
      )
      .setFooter(`Vade Moderation`, client.user.displayAvatarURL())
      .setTimestamp();
    return message.channel.send(roleEmbed);
    }

    case "remove": {

      if(!locate_schema.ModRole.length) return message.channel.send(`There are currently no Moderator Roles setup for this Server!`);

    if(!args[1]) return message.channel.send(`Please mention a valid role name, ID or mention.`);
    const role = client.utils.getRoles(args[1], message.guild);
    if(!role) return message.channel.send(`Please mention a valid role name, ID or mention.`);
    let roleID = role.id;

    if(!locate_schema.ModRole.includes(roleID)) return client.utils.sendError(`The Role: ${role} is currently not set as a Moderator role for this Server!`, message.channel);
    

    await locate_schema.updateOne({
      $pull: { ModRole: roleID } 
    });

    return client.utils.succEmbed(`Successfully removed ${role} from the Moderator Roles in this Server!`, message.channel);


    }

    case "add": {

      if(!args[1]) return message.channel.send(`Please mention a valid role name, ID or mention.`);
    const role = client.utils.getRoles(args[1], message.guild);
    if(!role) return message.channel.send(`Please mention a valid role name, ID or mention.`);
    let roleID = role.id;
    if(locate_schema.ModRole && locate_schema.ModRole?.length >= 5) return message.channel.send(`You cannot have more than 5 Moderator Roles setup for one Server.`);

    await locate_schema.updateOne({
      $push: { ModRole: role.id }
    });

    return client.utils.succEmbed(`Successfully set ${role} as a Moderator Role!`, message.channel);

    }

    default:
      return message.channel.send(`Please specify either \`add\`, \`remove\` or \`list\`.`);
  }


};

export const name: string = "modrole";
export const category: string = "Administrative";
export const description: string = "Configure the guilds moderator role.";
export const aliases: string[] = ["mrole"];
export const userPerms: string[] = ['MANAGE_GUILD'];
export const botPerms: string[] = ['MANAGE_ROLES'];
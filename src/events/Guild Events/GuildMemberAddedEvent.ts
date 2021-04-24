import { RunFunction } from "../../interfaces/Event";
import findAutorole from "../../../models/autoroles";
import { GuildMember, TextChannel } from "discord.js";
import Guild from '../../../models/guild';

export const run: RunFunction = async (client, member: GuildMember) => {
  try {
    let fetchList = await findAutorole.findOne({
      guildID: member.guild.id,
      enabled: true,
    });
    console.log(fetchList);
    if (!fetchList || !fetchList.roles.length) return;
    fetchList.roles.forEach(async (role) => {
      console.log(role);
      const findRole = client.utils.getRoles(role, member.guild);
      if (!member.guild.me.hasPermission("MANAGE_ROLES")) return;
      if (findRole.position > member.guild.me.roles?.highest.position) return;
      if (!findRole) {
        await findAutorole.findOneAndUpdate(
          {
            guildID: member.guild.id,
          },
          {
            $pull: { roles: role },
          }
        );
      } else {
        if (!member.roles.cache.has(findRole.id))
          await member.roles.add(findRole.id);
      }
    });
  } catch (e) {
    console.log(e);
  }


  const locate_main_data = await Guild.findOne({ guildID: member.guild.id });
  const type = (locate_main_data)?.welcomeType;
  const welcome_channel = locate_main_data.welcomeChannel;
  if(!welcome_channel) return;
  const guildChannel = client.channels.cache.get(welcome_channel) as TextChannel;
  if(!guildChannel) return;
 
  switch(type) {

    case "message": {

      let msg;

      msg = (locate_main_data)?.welcomeMessage;
      if(msg) {
        guildChannel.send(member, msg);

      } else {
        guildChannel.send(`${member}, welcome to the server!`);
      }


    }

    case "image": {

    }

    default: 
    return;
  }
  

  
};
export const name: string = "guildMemberAdd";

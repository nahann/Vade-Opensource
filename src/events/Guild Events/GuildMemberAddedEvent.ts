import { RunFunction } from "../../interfaces/Event";
import findAutorole from "../../../models/autoroles";
import { GuildMember } from "discord.js";

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
};
export const name: string = "guildMemberAdd";

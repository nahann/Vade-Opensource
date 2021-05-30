import type { RunFunction } from "../../interfaces/Event";
import { TextChannel, Util, TextChannel } from "discord.js-light";
import Guild from "../../models/GuildConfig/guild";
import findStickyRole from "../../models/GuildConfig/stickyroles";
import inviterSchema from '../../models/Invites/inviter';
import inviteMemberSchema from '../../models/Invites/inviteMember';

export const run: RunFunction = async (client, member) => {
  const locate_main_data = await Guild.findOne({ guildID: member.guild.id });
  const type = locate_main_data?.welcomeType;
  const welcome_channel = locate_main_data?.welcomeChannel;
  if (!welcome_channel) return;
  const guildChannel = client.channels.cache.get(
    welcome_channel
  ) as TextChannel;
  const fetchList = await findStickyRole.findOne({
    guildID: member.guild.id,
    enabled: true,
  });

  if (fetchList && member._roles.length) {
    try {
      await findStickyRole.findOneAndUpdate(
        {
          guildID: member.guild.id,
        },
        {
          $pull: {
            roles: {
              userID: member.user.id,
            },
          },
        }
      );

      await findStickyRole.findOneAndUpdate(
        {
          guildID: member.guild.id,
        },
        {
          $push: {
            roles: {
              userID: member.user.id,
              userRoles: member._roles,
            },
          },
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  if (guildChannel) {
    switch (type) {
      case "message": {
        guildChannel.send(
            `${Util.escapeMarkdown(member.user.tag)} has left the server!`
        );
        break;
      }

    }
  }

  const inviteChannel = (await client.channels.fetch(locate_main_data?.inviteChannel)) as TextChannel;
  if(inviteChannel) {
    const inviteMemberData = await inviteMemberSchema.findOne({
      guildID: member.guild.id,
      userID: member.user.id,
    });
    if (!inviteMemberData) {
      inviteChannel.send(
          `\`${member.user.tag}\` They left our server but I could not find out who they were invited by.`
      );
    } else {
      const inviter = await client.users.fetch(inviteMemberData.inviter);
      await inviterSchema.findOneAndUpdate(
          { guildID: member.guild.id, userID: inviter.id },
          { $inc: { leave: 1, total: -1 } },
          { upsert: true }
      );
      const inviterData = await inviterSchema.findOne({
        guildID: member.guild.id,
        userID: inviter.id,
      });
      const total = inviterData ? inviterData.total : 0;
      const totalInvite = total < 0 ? 0 : total;
      inviteChannel.send(
          `\`${member.user.tag}\` left our server. They were invited by ${inviter.tag} (**${totalInvite}** Invites)`
      );
    }
  }
};
export const name: string = "guildMemberRemove";

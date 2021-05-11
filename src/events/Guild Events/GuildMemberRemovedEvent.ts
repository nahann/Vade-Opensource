import { RunFunction } from "../../interfaces/Event";
import { TextChannel, Util } from "discord.js-light";
import Guild from "../../models/GuildConfig/guild";
import findStickyRole from "../../models/GuildConfig/stickyroles";

export const run: RunFunction = async (client, member) => {
  const locate_main_data = await Guild.findOne({ guildID: member.guild.id });
  const type = locate_main_data?.welcomeType;
  const welcome_channel = locate_main_data.welcomeChannel;
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

  if (!guildChannel) return;

  switch (type) {
    case "message": {
      guildChannel.send(
        `${Util.escapeMarkdown(member.user.tag)} has left the server!`
      );
    }

    case "image": {
    }
  }
};
export const name: string = "guildMemberRemove";

import { RunFunction } from "../../interfaces/Event";
import findAutorole from "../../models/autoroles";
import { GuildMember, TextChannel, Collection } from "discord.js-light";
import Guild from "../../models/GuildConfig/guild";
import findStickyRole from "../../models/GuildConfig/stickyroles";
import inviteMemberSchema from "../../models/Invites/inviteMember";
import inviterSchema from "../../models/Invites/inviter";

export const run: RunFunction = async (client, member: GuildMember) => {
  try {
    let fetchList = await findAutorole.findOne({
      guildID: member.guild.id,
      enabled: true,
    });
    console.log(fetchList);
    if (fetchList && fetchList.roles.length) {
    fetchList.roles.forEach(async (role) => {
      console.log(role);
      const findRole = client.utils.getRoles(role, member.guild);
      if (!member.guild.me.hasPermission("MANAGE_ROLES")) return;
      if (
        findRole &&
        findRole.position > member.guild.me.roles?.highest.position
      )
        return;
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
  }
  } catch (e) {
    console.log(e);
  }

  let fetchList = await findStickyRole.findOne({
    guildID: member.guild.id,
    roles: {
      $elemMatch: {
        userID: member.user.id,
      },
    },
    enabled: true,
  });

  if (fetchList) {
    let getMember = fetchList.roles.find((u) => u.userID === member.user.id);
    const findRole = client.guilds.cache.get(member.guild.id).roles.cache;

    fetchList.blacklist.forEach(async (role) => {
      if (!findRole.get(role)) {
        await findStickyRole.findOneAndUpdate(
          {
            guildID: member.guild.id,
          },
          {
            $pull: {
              blacklist: role,
            },
          }
        );
      }
    });

    let getRoles = getMember.userRoles.filter(
      (role) => fetchList.blacklist.indexOf(role) < 0
    );
    if (!getRoles.length) return;

    getRoles.forEach((role) => {
      console.log(`Working`);
      if (
        !findRole.get(role) ||
        findRole.get(role)?.position > member.guild.me.roles?.highest.position
      )
        return;
      member.roles.add(role);
    });

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
    } catch (e) {
      console.error(e);
    }
  }

  const locate_main_data = await Guild.findOne({ guildID: member.guild.id });
  const defaultWelcomeChannel = locate_main_data?.welcomeType;
  const welcome_channel = locate_main_data?.welcomeChannel;
  const invite_channel = locate_main_data?.inviteChannel;

  if (welcome_channel) {
    const guildChannel = (await client.channels.fetch(
      welcome_channel
    ) as TextChannel)
    if(guildChannel) {
    if(defaultWelcomeChannel) {
      let msg;
      msg = locate_main_data?.welcomeMessage;
      if (msg) {
        guildChannel.send(member, msg);
      } else {
        guildChannel.send(`${member}, welcome to the server!`);
      }
     }
    }
  }

  if(invite_channel) {
    const channel = (await client.channels.fetch(invite_channel) as TextChannel);
    const gi: any = client.invites.get(member.guild.id) || new Collection();
  const invites = await member.guild.fetchInvites();
  const invite =
    invites.find((x) => gi.has(x.code) && gi.get(x.code).uses < x.uses) ||
    gi.find((x) => !invites.has(x.code)) ||
    member.guild.vanityURLCode;
  client.invites.set(member.guild.id, invites);

  if(!invite) {
    return channel.send(`${member} joined! Unable to locate who they were Invited by.`);
  }

  if (invite === member.guild.vanityURLCode) {
    channel.send(`${member} joined! Joined via Vanity URL.`);
  }
  if (!invite.inviter) return;
  await inviteMemberSchema.findOneAndUpdate(
    { guildID: member.guild.id, userID: member.user.id },
    { $set: { inviter: invite.inviter.id, date: Date.now() } },
    { upsert: true }
  );
  if (
    Date.now() - member.user.createdTimestamp <=
    1000 * 60 * 60 * 24 * 7
  ) {
    await inviterSchema.findOneAndUpdate(
      { guildID: member.guild.id, userID: invite.inviter.id },
      { $inc: { total: 1, fake: 1 } },
      { upsert: true }
    );
    const inviterData = await inviterSchema.findOne({
      guildID: member.guild.id,
      userID: invite.inviter.id,
    });
    const total = inviterData ? inviterData?.total : 0;
    channel.send(
      `${member} joined our server. Was invited by ${invite.inviter.tag} (**${total}** Invites)`
    );
  } else {
    await inviterSchema.findOneAndUpdate(
      { guildID: member.guild.id, userID: invite.inviter.id },
      { $inc: { total: 1, regular: 1 } },
      { upsert: true }
    );
    const inviterData = await inviterSchema.findOne({
      guildID: member.guild.id,
      userID: invite.inviter.id,
    });
    const total = inviterData ? inviterData.total : 0;
    channel.send(
      `${member} joined our server. They were invited by ${invite.inviter.tag} (**${total}** Invites)`
    );
  }

  }












};
export const name: string = "guildMemberAdd";

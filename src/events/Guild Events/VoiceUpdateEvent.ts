import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";
import findBind from "../../models/GuildConfig/bind";
import type { VoiceChannel } from "discord.js-light";
const GREEN = '#00C09A';

export const run: RunFunction = async (
  client: Bot,
  oS,
  nS
) => {

    const newUserChannel = nS?.channelID;
    const oldUserChannel = oS?.channelID;
    const findRole = (await client.guilds.fetch(nS?.guild.id))?.roles.cache;
    const findChannel = client.channels.cache;

    let member = client.guilds.cache
        .get(nS?.guild.id)
        .members.cache.get(nS.id);

    let newChannelList = await findBind.findOne({
        voiceChannelID: newUserChannel,
    });
    let oldChannelList = await findBind.findOne({
        voiceChannelID: oldUserChannel,
    });

    if (newChannelList) {
        const role = findRole.get(newChannelList.roleID);
        if (!role) {
            let newRole = await client.guilds.cache
                .get(nS.guild.id)
                .roles.create({
                    data: {
                        name: `Link - ${(findChannel.get(newUserChannel) as VoiceChannel).name}`,
                        permissions: [],
                    },
                });
            newChannelList.textChannelArr.forEach((textChannelID) => {
                (findChannel
                    .get(textChannelID) as VoiceChannel)
                    .updateOverwrite(newRole, { VIEW_CHANNEL: true });
            });
            await findBind.findOneAndUpdate(
                {
                    voiceChannelID: newUserChannel,
                },
                {
                    $set: {
                        roleID: newRole.id,
                    },
                },
                {
                    new: true,
                },
                (err) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                }
            );
            await member.roles.add(newRole);
        } else {
            await member.roles.add(role);
        }
    }

    if (oldChannelList) {
        if (oldUserChannel !== newUserChannel) {
            const role2 = findRole.get(oldChannelList.roleID);
            if (role2) {
                await member.roles.remove(role2);
            }
        }
    }

    const logChannel = await client.utils.resolveLogChannel(
        oS.guild.id,
        "voice"
    );
    if (!logChannel) return;

    let embed = new client.embed().setTimestamp();

    let u = nS.member.user.tag;
    let avatar = nS.member.user.displayAvatarURL();
    //User joined/left a channel
    if ((!oS.channelID && nS.channelID) || (oS.channelID && !nS.channelID)) {
        embed
            .setAuthor(u, avatar)
            .setTitle(
                `${
                    nS.channelID
                        ? `📥 Joined Voice Channel`
                        : `📤 Left Voice Channel `
                }`
            )
            .setDescription(
                `**Channel:** \`#${
                    nS.channelID ? `${nS.channel.name}` : `${oS.channel.name}`
                }\``
            )
            .setThumbnail(avatar)
            .setColor(`${nS.channelID ? GREEN : `RED`}`);
        return logChannel.send(embed);
    }

    if ((!oS.streaming && nS.streaming) || (oS.streaming && !nS.streaming)) {

        embed
            .setAuthor(u, avatar)
            .setTitle(
                `${nS.streaming ? "🖥️ Started" : "🖥️ Stopped"} streaming!`
            )
            .setDescription(
                `**Channel:** \`#${
                    nS.channelID ? `${nS.channel.name}` : `${oS.channel.name}`
                }\``
            )
            .setThumbnail(avatar)
            .setColor(nS.streaming ? GREEN : `RED`);
        return logChannel.send(embed);
    }

    if (
        (!oS.serverDeaf && nS.serverDeaf) ||
        (oS.serverDeaf && !nS.serverDeaf)
    ) {
        embed
            .setAuthor(u, avatar)
            .setTitle(
                `${
                    nS.serverDeaf
                        ? "🔇 User Server-Deafened"
                        : "🎧 User Server-Undeafened"
                }`
            )
            .setDescription(
                `**Channel:** \`${
                    nS.channelID ? `${nS.channel.name}` : `${oS.channel.name}`
                }\``
            )
            .setThumbnail(avatar)
            .setColor(nS.serverDeaf ? "RED" : GREEN);
        return logChannel.send(embed);
    }

    //User was muted/unmuted by an Moderator
    if (
        (!oS.serverMute && nS.serverMute) ||
        (oS.serverMute && !nS.serverMute)
    ) {
        embed
            .setAuthor(u, avatar)
            .setTitle(
                `${
                    nS.serverMute
                        ? "🔇 User Server-Muted"
                        : "🔊 User Server-Unmuted"
                }`
            )
            .setDescription(
                `**Channel:** \`${
                    nS.channelID ? `${nS.channel.name}` : `${oS.channel.name}`
                }\``
            )
            .setThumbnail(avatar)
            .setColor(nS.serverMute ? "RED" : GREEN);
        return logChannel.send(embed);
    }

    //User switched channels
    if (oS.channelID !== nS.channelID && oS.channelID && nS.channelID) {
        embed
            .setColor("YELLOW")
            .setAuthor(u, avatar)
            .setThumbnail(avatar)
            .setTitle("🔀 Voice Channel Changed")
            .setDescription(
                `**From:** \`#${oS.channel.name}\`\n**To:** \`#${nS.channel.name}\``
            );
        return logChannel.send(embed);
    }

};

export const name: string = "voiceStateUpdate";
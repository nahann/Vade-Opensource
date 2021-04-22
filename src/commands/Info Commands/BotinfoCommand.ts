import { RunFunction } from '../../interfaces/Command';
import { version  } from 'discord.js';
import { utc } from 'moment';
import os from 'os';
import ms from 'ms';
const core = os.cpus()[0];

export const run: RunFunction = async(client, message, args) => {

    const clientVersion = client.version;

    const embed = new client.embed()
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(message.guild.me.displayHexColor || client.constants.colours.turquoise)
    .addField("__General__", [
        `**❯** Bot: **${client.user.tag} (${client.user.id})**`,
        `**❯** Commands: **${client.commands.size}**`,
        `**❯** Servers: **${client.guilds.cache.size.toLocaleString()}**`,
        `**❯** Users: **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}**`,
        `**❯** Channels: **${client.channels.cache.size.toLocaleString()}**`,
        `**❯** Creation Date: **${utc(client.user.createdTimestamp).format("Do MMMM YYYY HH:mm:ss")}**`,
        `**❯** Node.js: **${process.version}**`,
        `**❯** Discord.js: **${version}**`
    ])
    .setBlankField()
    .addField("__System__", [
    `**❯** Platform: **${process.platform}**`,
    `**❯** Uptime: **${ms(os.uptime() * 1000, { long: true })}**`
    ])
    .addField("__CPU__", [
        `**❯** Cores: **${os.cpus().length}**`,
        `**❯** Model: **${core.model}**`,
        `**❯** Speed: **${core.speed}MHz**`
    ])
    .setTimestamp()
    .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
    
    message.channel.send(embed);

}

export const name: string = 'botinfo';
export const category: string = 'Information';
export const aliases: string[] = ['bi', 'botinformation'];
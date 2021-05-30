import type {RunFunction} from "../../interfaces/Event";
import type {Bot} from "../../client/Client";

export const run: RunFunction = async (
    client: Bot,
    oldMember,
    newMember
) => {

    if (!newMember.guild) return;

    const u = newMember.user.tag;
    const avatar = newMember.user.displayAvatarURL();

    let roleChange = new client.embed()
        .setAuthor(`${u}`, avatar)
        .setFooter(`Vade Logging System`);

    const color = "#00f2ff";

    const logChannel = await client.utils.resolveLogChannel(
        newMember.guild.id,
        "user"
    );

    if (!logChannel) return;

    if (oldMember.nickname !== newMember.nickname) {
        let nicknameChanged = new client.embed()
            .setTitle("Nickname Changed")
            .addField("User", `${oldMember.user.tag}`)
            .addField(
                "Before",
                `${oldMember.nickname ? oldMember.nickname : "None"}`
            )
            .addField(
                "After",
                `${newMember.nickname ? newMember.nickname : "None"}`
            )
            .setColor(color)
            .setTimestamp();
        logChannel.send(nicknameChanged);
    }
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache
        for (const old of oldRoles.map((e) => e.id)) {
            // Removed a role
            if (!newRoles.has(old)) {
                roleChange
                    .setTitle(`A role has been removed!`)
                    .setDescription(`**Role:** <@&${old}>`)
                    .setThumbnail(avatar)
                    .setColor("RED");
                return logChannel.send(roleChange);
            }
        }
        for (const added of newRoles.map((e) => e.id)) {
            // Added a role
            if (!oldRoles.has(added)) {
                roleChange
                    .setTitle(`A role has been added!`)
                    .setDescription(`**Role:** <@&${added}>`)
                    .setThumbnail(avatar)
                    .setClear()

                return logChannel.send(roleChange);
            }
        }
    }

};

export const name: string = "guildMemberUpdate";
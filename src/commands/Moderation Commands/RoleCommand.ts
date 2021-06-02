import { PermissionString } from "discord.js";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  // ?role in <Inrole> <Role> - Role anyone that has the role specified the role specified. E.g ?role in Members Website Updates.

  const [sub, ...ctx] = args;

  switch (sub) {
    case "removeall": {
      const [id] = ctx;

      const member = await client.utils.getMember(message, id, true);

      if (!member) return;

      await Promise.all(
        member.roles.cache.map(async (role) => {
          try {
            return member.roles.remove(role.id);
          } catch {
            return message.channel.send(
              `Unable to remove the role <@&${role}>`,
              { disableMentions: "all" }
            );
          }
        })
      );

      return message.channel.send(
        `Removed all roles from the member successfully.`
      );
    }

    case "set": {
      // you fucking paginate the roles u lazy shit
    }

    case "all": {
      const [id] = ctx;

      const role =
        message.guild.roles.cache.find(
          ({ name }) => name.toLowerCase() === id.toLowerCase()
        ) ??
        (await message.guild.roles.fetch(id)) ??
        message.mentions.roles.first();

      if (!role) return message.channel.send(`I could not find the role!`);

      const msg = await message.channel.send(`Adding roles to all members...`);

      await Promise.all(
        message.guild.members.cache.map(async (member) => {
          try {
            await member.roles.add(role);
          } catch {}

          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        })
      );

      return msg.edit(`Added all roles successfully!`);
    }

    case "bots": {
      const [id] = ctx;

      const role = client.utils.getRoles(id, message.guild);

      if (!role) return message.channel.send(`I could not find the role!`);

      const msg = await message.channel.send(`Adding roles to all bots..`);

      await Promise.all(
        message.guild.members.cache
          .filter(({ user: { bot } }) => bot)
          .map(async (member) => {
            try {
              await member.roles.add(role);
            } catch {}

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          })
      );

      return msg.edit(`Added all roles successfully!`);
    }

    case "humans": {
      const [id] = ctx;

      const role = client.utils.getRoles(id, message.guild)
      if (!role) return message.channel.send(`I could not find the role!`);

      const msg = await message.channel.send(`Adding roles to all humans..`);

      await Promise.all(
        message.guild.members.cache
          .filter(({ user: { bot } }) => !bot)
          .map(async (member) => {
            try {
              await member.roles.add(role);
            } catch {}

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          })
      );

      return msg.edit(`Added all roles successfully!`);
    }

    default: {
      const [id, ...ids] = args;

      const member = await client.utils.getMember(message, id, true);

      if (!member) return;

      try {
        await Promise.all(
          (
            await Promise.all(
              ids.map(async (id) => {
              const role = client.utils.getRoles(id, message.guild);
              if(role) return role;
              throw new TypeError(`Unable to  find the role!`);
              })
            )
          ).map(async (role, i) => {
            if (!role)
              return message.channel.send(
                `Unable to find the role ${ids[i]}.`,
                { disableMentions: "all" }
              );

            try {
              if (member.roles.cache.has(role.id) || ids[i].startsWith("-"))
                await member.roles.remove(role);
              else if (
                !member.roles.cache.has(role.id) ||
                ids[i].startsWith("+")
              )
                await member.roles.add(role);
            } catch {
              return message.channel.send(`Unable to add the role ${ids[i]}.`, {
                disableMentions: "all",
              });
            }
          })
        );
      } catch (e) {
        return message.channel.send(e.message);
      }
      client.utils.succEmbed(`Successfully added the role(s).`, message.channel);
    }
  }
};

export const name: string = "role";
export const usage: string =
  "!role <User name, ID or mention> <Roles to add/remove seperated by commas>.";
export const userPerms: PermissionString[] = ["MANAGE_ROLES"];
export const botPerms: PermissionString[] = ["MANAGE_ROLES"];
export const guildOnly: boolean = true;
export const category: string = "Moderation";
export const modCommand: boolean = true;

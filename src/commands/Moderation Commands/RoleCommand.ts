import { PermissionString } from "discord.js";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  // ?role @user Role,Role, || , Role
  // If they have the role, it removes - Also removes if the role name starts with "-".
  // If they do not have the role, it adds - Also adds if the role name starts with "+".
  // ?role removeall @user. - Removes ALL the users roles.
  // ?role set @user <List of roles to set the member>.
  // ?role all <Role>. - Role every single member of the Guild that role. Delay of around 1 second per user, send an embed with an estimated length of time until complete.
  // ?role bots <Role> - Role every single Bot in the Server that role. Delat of around 1 second per bot. Send an embed with an esitmated length of time until complete.
  // ?role humans <Role> - Role every single Human in the Server that role. Delat of around 1 second per user. Send an embed with an esitmated length of time until complete.
  // ?role in <Inrole> <Role> - Role anyone that has the role specified the role specified. E.g ?role in Members Website Updates.

  const [sub, ...ctx] = args;

  switch (sub) {
    case "removeall": {
      const [id] = ctx;

      const member = await client.utils.getMember(message, id);

      if (!member) return message.channel.send(`I could not find the member!`);

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

      message.channel.send(`Adding roles to all members...`);

      await Promise.all(
        message.guild.members.cache.map(async (member) => {
          await member.roles.add(role);

          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        })
      );

      return;
    }

    default: {
      const [id, ...ids] = ctx;

      const member = await client.utils.getMember(message, id);

      if (!member) return message.channel.send(`I could not find the member!`);

      try {
        await Promise.all(
          (
            await Promise.all(
              ids.map(async (id) => {
                if (/^(-\+)?\d{18,19}$/.test(id))
                  return message.guild.roles.fetch(
                    id.match(/^(-\+)?\d{18,19}$/)?.[0] ?? ""
                  );

                if (/^(-\+)?<@&\d{18,19}>$/.test(id))
                  return message.guild.roles.fetch(
                    id.match(/^(-\+)?<@&(\d{18,19})>$/)?.[0] ?? ""
                  );

                const role = message.guild.roles.cache.find(
                  ({ name }) => name.toLowerCase() === id.toLowerCase()
                );

                if (role) return role;

                throw new Error(`Unable to find the role ${id}.`);
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
    }
  }
};

export const name: string = "role";
export const usage: string =
  "!role <User name, ID or mention> <Roles to add/remove seperated by commas>.";
export const userPerms: PermissionString[] = ["MANAGE_ROLES"];
export const botPerms: PermissionString[] = ["MANAGE_ROLES"];
export const guildOnly: boolean = true;

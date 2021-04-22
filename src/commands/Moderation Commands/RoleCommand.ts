import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const mentioned_member = await client.utils.getMember(message, args[0], true);
    if(!mentioned_member) return;

    const roles = args.slice(1).join(" ").split(",");
    console.log(roles)


    let add = [];
    let remove = [];

    for(const role of roles) {

        const locate_role = client.utils.getRoles(role, message.guild);
        if(!locate_role) return message.channel.send(`Could not find a role for: **${role}**.`);

        if(mentioned_member.roles.cache.has(locate_role.id)) {
           await mentioned_member.roles.remove(locate_role.id);
            remove.push(`1`);
            return;
        }
        await mentioned_member.roles.add(locate_role);
        add.push(`1`);
       
    }





}

export const name: string = 'role';
export const usage: string = '!role <User name, ID or mention> <Roles to add/remove seperated by commas>.';
export const userPerms: string[] = ['MANAGE_ROLES'];
export const botPerms: string[] = ['MANAGE_ROLES'];
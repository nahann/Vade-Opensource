import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async(client, message, args) => {

    const regex = /^#[0-9A-F]{6}$/i;
    if(!args.length) return client.utils.sendError(`You need to specify a role name and a hex code. Example: \`rolecolour testRole [hex code here].\``, message.channel);
    const role = client.utils.getRoles(args[0], message.guild);
    if(!role) return client.utils.sendError(`Couldn't locate that role. Please try again.`, message.channel);
    if(!args[1]) return client.utils.sendError(`You need to specify a hex code.`, message.channel);
    if(!regex.test(args[1])) return client.utils.sendError(`You provided an invalid hex code.`, message.channel);

    if(role.position > message.guild.me.roles?.highest.position) return client.utils.sendError(`Unable to edit that role. Please check my role positio(s).`, message.channel);

    await role.edit({ color: args[1], permissions: role.permissions, hoist: role.hoist, position: role.position, mentionable: role.mentionable });
    return client.utils.succEmbed(`Successfully changed the colour of ${role} to "${args[1]}"`, message.channel);

}

export const name: string = 'rolecolour';
export const category: string = ''
export const description: string = ''
export const aliases: string[] = ['rolecolor','color'];
export const userPerms: string[] = ['']
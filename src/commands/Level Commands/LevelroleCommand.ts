import type { RunFunction } from '../../interfaces/Command';
import main_schema from '../../models/GuildConfig/levelRoles';

export const run: RunFunction = async(client, message, args) => {

    const locate_schema = await main_schema.findOne({
        Guild: message.guild.id,
    });
    const totalAmount = await main_schema.find({ Guild: message.guild.id });

    const toSwitch = args[0];

    switch (toSwitch) {
        case "add": {
            if (!message.member.permissions.has("MANAGE_ROLES"))
                return message.channel.send(
                    `You need the MANAGE_ROLES permission to do this action. You may only run the \`list\` option.`
                );
            // Example: !levelrole add <role ID> <Level amount>

            const checkPremium = await client.utils.checkPremium(message.guild.ownerID)

            if (totalAmount && totalAmount.length > 3 && !checkPremium)
                return message.channel.send(
                    `The server owner must own Vade Premium in order to have more than 3 level roles.`
                );

            const role = client.utils.getRoles(args[1], message.guild);
            const levelAmount = parseInt(args[2]);
            if (
                !role ||
                !levelAmount ||
                !role ||
                isNaN(levelAmount) ||
                levelAmount.toString().startsWith("-")
            )
                return message.reply(
                    `Please specify a role name, ID or mention along with the level that should get the role.`
                );
            if (levelAmount > 100)
                return message.channel.send(
                    `You cannot have a level requirement higher than Level 100.`
                );

            if (totalAmount && totalAmount.find((m) => parseInt(m.Level) === levelAmount))
                return message.channel.send(
                    `You already have a level Role set for that Level.`
                );

            const newSchema = new main_schema({
                Guild: message.guild.id,
                Role: role,
                Level: levelAmount,
            });

            await newSchema.save();
            message.channel.send(`Successfully saved that configuration.`);

            break;
        }


        case "list": {
            if (!totalAmount || !totalAmount.length)
                return message.channel.send(`This Guild has no Level Roles setup.`);

            let totalEmbed = new client.embed().setTitle(
                `${message.guild.name}'s Level Roles`
            );

            let i = 1;

            for (const first of totalAmount) {
                console.log(first);

                totalEmbed.addField(
                    `**${i}**.`,
                    `<@&${first.Role ? first.Role : `Unknown.`}> : Level ${
                        first.Level ? first.Level : "Unknown."
                    }`
                );
                i++;
            }

            return message.channel.send(totalEmbed);
        }


        case "remove": {
            if (!message.member.permissions.has("MANAGE_ROLES"))
                return message.channel.send(
                    `You need the MANAGE_ROLES permission to do this action. You may only run the \`list\` option.`
                );
            if (!totalAmount || !totalAmount.length)
                return message.channel.send(`This Guild has no Level Roles setup.`);
            const lvl = parseInt(args[1]);
            if (!lvl || isNaN(lvl) || lvl.toString().startsWith("-"))
                return message.channel.send(`Please specify a Level to remove the role for.`);
            const findLevel = await totalAmount.find((m) => parseInt(m.Level) === lvl);
            if (!findLevel)
                return message.channel.send(
                    `I couldn't locate a level role configured for that level.`
                );

            await findLevel.delete();
            message.channel.send(`Successfully removed that level role.`);

            break;
        }


        default:
            return message.channel.send(
                `Please specify one of the following options: \`add\`, \`list\` or \`remove\`.`
            );
    }

}

export const name: string = 'levelrole';
export const category: string = 'Levels';
export const description: string = 'Configure the guilds level roles.';
export const aliases: string[] = ['lvlrole'];
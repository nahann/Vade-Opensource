import { RunFunction } from '../../interfaces/Command';
import MainSchema from '../../models/GuildConfig/linkedgames';


   export const run: RunFunction = async(client, message, args) => {

    
    const LocateAll = await MainSchema.find({ guildID: message.guild.id });
    const checkPremium = await client.utils.checkPremium(message.guild.ownerID);
    if(LocateAll && LocateAll.length >= 3 && !checkPremium) return message.channel.send(`The guild owner must own Vade Premium to link more than 3 games.`);
    if(!args[0] || !client.config.validGames.includes(args[0].toLowerCase())) return client.utils.sendError(`You need to provide a valid game. Valid games:\n ${client.config.validGames.join("\n")}`, message.channel);
    if(!args[1]) return client.utils.sendError(`You need to provide a valid role.`, message.channel);
    const role = client.utils.getRoles(args[1], message.guild);
    if(!role) return client.utils.sendError(`You need to provide a valid role.`, message.channel);

    const LocatedSchema = await MainSchema.findOne({ guildID: message.guild.id, roleID: role.id });

    if(!LocatedSchema) {

        const newSchema = new MainSchema({
            guildID: message.guild.id,
            gameName: args[0].toLowerCase(),
            roleID: role.id
        });

        await newSchema.save();

        return client.utils.succEmbed(`Successfuly linked "${client.utils.capitalise(args[0])}" to the role ${role}!`, message.channel);


    } else {
        return client.utils.sendError(`That role is already linked to another game! It is linked to "${LocatedSchema.gameName}`, message.channel);
    }



    }
export const name: string = 'linkgame';
export const category: string = 'Administrative';
export const description: string = 'Link a game to a Discord Role. When someone begins to play the game, they will be given the specified role.';
export const aliases: string[] = ['lgame'];
export const premiumOnly: boolean = true;

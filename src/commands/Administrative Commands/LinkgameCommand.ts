import { RunFunction } from '../../interfaces/Command';
import MainSchema from '../../models/GuildConfig/linkedgames';


   export const run: RunFunction = async(client, message, args) => {

    const text = args.join(" ");

    const regex = text.match(/"[^"]+"|[\\S]+"[^"]+/g);
   
    if(!regex || !regex.length || regex.length > 1 || !client.config.validGames.includes(regex[0]?.replace(/"/g, "")?.toLowerCase())) return client.utils.sendError(`You need to provide a valid game. For example: !linkgame @role "Valorant". Valid games:\n ${client.config.validGames.join("\n")}`, message.channel);

    const LocateAll = await MainSchema.find({ guildID: message.guild.id });
    const checkPremium = await client.utils.checkPremium(message.guild.ownerID);
    if(LocateAll && LocateAll.length >= 3 && !checkPremium) return message.channel.send(`The guild owner must own Vade Premium to link more than 3 games.`);
    if(!args[0]) return client.utils.sendError(`You need to provide a valid role or specify "remove!.`, message.channel);
    if(args[0].toLowerCase() === 'remove') {


      if(!args[1]) return client.utils.sendError(`You need to provide a role name, mention or ID.`, message.channel);
      const role = client.utils.getRoles(args[1], message.guild);
      if(!role) return client.utils.sendError(`You need to provide a valid role.`, message.channel);

      const checkValid = LocateAll.find((m) => m.roleID === role.id);
      if(!checkValid) return client.utils.sendError(`That role is not linked to a game.`, message.channel);
      await checkValid.delete();

      return client.utils.succEmbed(`Successfully removed that binding.`, message.channel);


    }
    const role = client.utils.getRoles(args[0], message.guild);
    if(!role) return client.utils.sendError(`You need to provide a valid role.`, message.channel);

    const LocatedSchema = await MainSchema.findOne({ guildID: message.guild.id, roleID: role.id });

    if(!LocatedSchema) {

        const newSchema = new MainSchema({
            guildID: message.guild.id,
            gameName: regex[0]?.replace(/"/g, "")?.toLowerCase(),
            roleID: role.id
        });

        await newSchema.save();

        return client.utils.succEmbed(`Successfuly linked ${client.utils.capitalise(regex[0])} to the role ${role}!`, message.channel);


    } else {
        return client.utils.sendError(`That role is already linked to another game! It is linked to "${LocatedSchema.gameName}`, message.channel);
    }

    /**
     *  const polls = args.join(" ");

  const regex = polls.match(/"[^"]+"|[\\S]+"[^"]+/g);
  const title = polls.match(/([^"]+)"/s)?.[0].trim();
  if (!regex)
    return message.reply(
      'Please enter your options in quotation marks. Example: !poll "option 1" "option 2" "option 3".'
    );
  if (regex.length > 10) {
    return message.reply("You can only have 10 poll options");
  }
  let str = "";
  const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
  let col = 0;
  for (const poll of regex) {
    str = `${str}${emojis[col]} ${poll}\n\n`;
    col++;
  }
  const embed = new client.embed()
    .setTitle(title?.replace(/"/g, "") || "No Question")
    .setDescription(str.replace(/"/g, ""))
    .setClear();
     */



    }
export const name: string = 'linkgame';
export const category: string = 'Administrative';
export const description: string = 'Link a game to a Discord Role. When someone begins to play the game, they will be given the specified role.';
export const aliases: string[] = ['lgame'];
export const premiumOnly: boolean = true;

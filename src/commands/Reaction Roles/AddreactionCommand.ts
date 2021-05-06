import { Message, TextChannel } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

      let channel = client.utils.getChannels(args[0], message.guild) as TextChannel;
      if (!channel) return client.utils.sendError(`Please specify a valid channel.`, message.channel);
      
      let ID = args[1];
      if(!ID) return client.utils.sendError(`Please provide a valid message ID.`, message.channel);
      
      let messageID = await channel.messages.fetch(ID).catch(() => { return client.utils.sendError(`You must provide a valid message ID.`, message.channel) }) as Message;
  
    let role = client.utils.getRoles(args[2], message.guild);
      if (!role) return client.utils.sendError(`You must provide a valid role. You can provide a role mention, ID or a partial name.`, message.channel);
  
      if(role.managed) return client.utils.sendError(`You cannot use an integrated role.`, message.channel);
        
       let emoji = args[3];
  
      if (!emoji) return client.utils.sendError(`Please provide a valid emoji.`, message.channel);
  
      if (isCustomEmoji(args[3])) return client.utils.sendError(`You cannot use custom emojis.`, message.channel);
  
  try {
  
  await messageID.react(emoji)
  
  } catch(err){
   return client.utils.sendError(`Please provide a valid emoji.`, message.channel);
  }
   
      
      let option = parseInt(args[4])
      if(!option) option = 1
      if(isNaN(option)) option = 1
      if(option > 6) option = 1
      
      
      await client.utils.reactionCreate(message.guild.id , ID, role.id, emoji, false, option);
      
                  message.channel.send(new client.embed()
                  .setAuthor('Reaction Roles', message.guild.iconURL(),messageID.url)
                  .setSuccessColor()
                  .addField('Channel', channel, true)
                  .addField('Emoji', emoji, true)
                  .addField('Type', option, true)
                  .addField('Message ID', ID, true)
                  .addField('Message', `[Jump To Message](${messageID.url})`, true)
                  .addField('Role', role, true))
  
       

    }
export const name: string = 'addreaction';
export const category: string = 'Reaction Roles';
export const description: string = 'Add a reaction role.'
export const aliases: string[] = ['rradd'];
export const usage: string = '!addreaction <Channel mention> <Message ID> <Role> <Emoji> <Option>';
export const userPerms: string[] = ['MANAGE_ROLES'];
export const botPerms: string[] = ['MANAGE_ROLES'];

function isCustomEmoji(emoji) {
    return emoji.split(":").length == 1 ? false : true;
  }
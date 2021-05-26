import { Guild, GuildMember, Message } from "discord.js-light";
import arrays from '../Assets/Automod/messages.json';

const banned_words: Array<string> = arrays.array;


export namespace automod {

export function checkMessage(message: Message) {

   for(const msg of message.content.split(" ")) {
       if(banned_words.includes(msg)) {
           return true;
       } 
   }
}

export function checkMod(member: GuildMember, modRoles: Array<string>) {
    for(const role of modRoles) {
        if(member.roles.cache.has(role) || member.permissions.has("MANAGE_MESSAGES")) {
            return true;
        } else {
            return false;
        }
    }
}

export function checkAdmin(member: GuildMember, adminRoles: Array<string>) {
    for(const role of adminRoles) {
        if(member.roles.cache.has(role) || member.permissions.has("MANAGE_GUILD")) {
            return true;
        } else {
            return false;
        }
    }
}

}
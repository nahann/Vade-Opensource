import arrays from '../Assets/Automod/messages.json';

import type {GuildMember, Message} from "discord.js";

const banned_words: Array<string> = arrays.array;
export namespace automod {
    export function checkMessage(message: Message): boolean {
        for (const msg of message.content.split(" ")) {
            if (banned_words.includes(msg)) {
                return true;
            }
        }

        return false;
    }

    export function checkMod(member: GuildMember, modRoles: Array<string>): boolean {
        for (const role of modRoles) {
            if (member.roles.cache.has(role) || member.permissions.has("MANAGE_MESSAGES")) {
                return true;
            }
        }

        return false;
    }

    export function checkAdmin(member: GuildMember, adminRoles: Array<string>): boolean {
        for (const role of adminRoles) {
            if (member.roles.cache.has(role) || member.permissions.has("MANAGE_GUILD")) {
                return true;
            }
        }

        return false;
    }
}
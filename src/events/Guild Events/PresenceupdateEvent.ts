import { RunFunction } from "../../interfaces/Event";
import MainSchema from '../../models/GuildConfig/linkedgames';
import peoplePlaying from '../../models/players';

import type { Presence } from "discord.js-light";

const cooldown: Map<string, string> = new Map();

export const run: RunFunction = async (
  client,
  oldPresence: Presence,
  newPresence: Presence
) => {

  const userID = newPresence.user.id;
  const check = await peoplePlaying.findOne({ userID });

  if(check) {
    const locate = await MainSchema.find({ gameName: check.gameName });
    if(!locate) return;
    
    for(const one of locate) {
      const guild = await client.guilds.fetch(one.guildID);
      if(guild) {
        const member = await guild.members.fetch(userID);
        if(member) {
          const role = await guild.roles.fetch(one.roleID);
          if(role) {
            if(role.position < guild.me?.roles.highest.position && guild.me.permissions.has("MANAGE_ROLES")) {
              await member.roles.remove(role.id);
              await check.delete();
            }
          }
        }
      }
    }
  }

  if (newPresence?.activities) {
    const playingActivities = newPresence.activities.filter(
      (m) => m.type === "PLAYING"
    );

    const activity = playingActivities[0]; 
    if (!activity?.name) {
      return;
    }

    const locateSchema = await MainSchema.find({ gameName: activity.name?.toLowerCase() });
    if(!locateSchema) return;
    

    const valid: Array<string> = [
      "skyblock",
      "call of duty®: modern warfare®",
      "osu!",
      "valorant",
      "spotify",
      "brawl stars",
      "roblox"
    ];

    if (!valid.includes(activity.name?.toLowerCase())) {
      return;
    }


    for(const one of locateSchema) {
      const guild = await client.guilds.fetch(one.guildID);
      if(guild) {
        const member = await guild.members.fetch(userID);
        if(member) {
          const role = await guild.roles.fetch(one.roleID);
          if(role) {
            if(role.position < guild.me?.roles.highest.position && guild.me.permissions.has("MANAGE_ROLES")) {
             await member.roles.add(role);

             const newSchema = new peoplePlaying({
               userID,
               gameName: activity.name?.toLowerCase()
             });
             await newSchema.save();
            }
          }
        }
      }


    }

    cooldown.set(userID, activity.name);

  }
};

export const name: string = "presenceUpdate";

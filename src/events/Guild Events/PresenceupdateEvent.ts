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

    const activity = playingActivities[0]; // Activity object
    if (!activity?.name) {
      return;
    }

    const locateSchema = await MainSchema.find({ gameName: activity.name?.toLowerCase() });
    if(!locateSchema) return;
    

    console.log(`Passed "PLAYING" validation`)

    const valid: Array<string> = [
      "skyblock",
      "call of duty®: modern warfare®",
      "osu!",
      "valorant",
      "spotify",
      "brawl stars",
      "roblox"
    ];

    console.log(activity.name?.toLowerCase())

    if (!valid.includes(activity.name?.toLowerCase())) {
      return;
    }

    //  "Playing Valorant" - Vade Community
    // User roles + Playing Valorant
    // Stops playing "Valorant" and they start playing "osu!", valorant role is removed, and osu role is added if configured

    /* 
        User switches to playing a game, example being "valorant",
        Bot detects that and for every server with a role set for "valorant", it will role them as that role,
        This can be for multiple activities.
        */

    // wtf, was it echoing?
    // or did my audio drivers completely die







    for(const one of locateSchema) {

      console.log(`It's here`)

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
             console.log(`Saved the schema`);

            }
          }
        }
      }


    }

    cooldown.set(userID, activity.name);

  }
};

export const name: string = "presenceUpdate";

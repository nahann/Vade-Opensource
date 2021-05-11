import { RunFunction } from "../../interfaces/Event";

import type { Presence } from "discord.js-light";

const cooldown: Map<string, string> = new Map();

export const run: RunFunction = async (
    client,
    oldPresence: Presence,
    newPresence: Presence
) => {
    if (newPresence?.activities) {
        const playingActivities = newPresence.activities.filter(
            (m) => m.type === "PLAYING"
        );

        const activity = playingActivities[0]; // Activity object
        if (!activity?.name) {
            return;
        }

        const valid: Array<string> = [
            "skyblock",
            "call of duty®: modern warfare®",
            "osu!",
            "valorant",
        ];

        if (!valid.includes(activity.name.toLowerCase())) {
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

        const userID = newPresence.user.id;
        const check = cooldown.get(newPresence.user.id);
        console.log(cooldown);
        if (check && check === activity.name) {
            // Return if they are playing the same game when updated
            return;
        }

        cooldown.set(userID, activity.name);
        console.log(cooldown);

        client.setTimeout(() => {
            cooldown.delete(userID);
        }, 10000);
    }
};

export const name: string = "presenceUpdate";

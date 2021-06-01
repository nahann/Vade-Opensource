import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";

export const run: RunFunction = async (
  client: Bot,
  invite
) => {

    const gi: any = client.invites.get(invite.guild.id);
    if(gi.has(invite.code)) {
        await gi.delete(invite.code);
    }

};

export const name: string = "inviteDelete";
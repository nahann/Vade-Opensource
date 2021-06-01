import type { RunFunction } from "../../interfaces/Event";
import type { Bot } from "../../client/Client";

export const run: RunFunction = async (
  client: Bot,
  invite
) => {

    const gi: any = client.invites.get(invite.guild.id);
    gi.set(invite.code, invite);
    client.invites.set(invite.guild.id, gi);

};

export const name: string = "inviteCreate";
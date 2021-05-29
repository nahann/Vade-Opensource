// import { EventEmitter } from "events";
// import { decode } from "@lavalink/encoding"
// import { Manager, SocketData, Player } from "lavaclient";
// import { LAVA_HOST, LAVA_PASSWORD, LAVA_PORT } from"../config.json"
//
// import type { Track } from "@lavaclient/types";
// import type { Bot } from "../client/Client";
//
// export namespace lavaclient {
//
//     const nodes: SocketData[] = [
//         {
//             id: "A",
//             host: LAVA_HOST,
//             port: LAVA_PORT,
//             password: LAVA_PASSWORD
//         }
//     ]
//
//     let manager: Manager
//
//     export async function connect(bot: Bot) {
//         manager = new Manager(nodes, {
//             send: (id, payload) => bot.guilds.forge(id).shard.send(payload),
//             userId: bot.user.id
//         });
//     }
//
//     class Queue extends EventEmitter {
//         readonly player: Player;
//
//         tracks: string[] = [];
//
//         constructor(player: Player) {
//             super();
//
//             this.player = player;
//             this.player.on("end", ({ reason, track }) => {
//                 this._end(reason, decode(track));
//             })
//         }
//
//
//
//         add(tracks: Track | Track[] | string) {
//
//         }
//
//         _end(reason: "TrackEndReason", track: Track) {
//         }
//
//     }
//
// }
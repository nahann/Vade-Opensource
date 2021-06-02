import type { RunFunction } from '../../interfaces/Command';
import { Collection, User } from 'discord.js';
import { stripIndents } from "common-tags";
import nums from "../../Assets/Minigames/bingo.json"

const SUCCESS_EMOJI_ID = "817905283547267122";
const rows = Object.keys(nums);
const callNums = Array.from({ length: 75 }, (_, i) => i + 1);

export const run: RunFunction = async(client, message, args) => {

    const awaitPlayers = client.utils.awaitPlayers;
    const msg = message;
    const playersCount = parseInt(args[0]);

    if (!playersCount)
        return msg.channel.send("Please specify the amount of players!");

    if (isNaN(playersCount))
        return message.channel.send(`The player count should be a number!`);

    if (playersCount > 20)
        return message.channel.send(`The maximum amount of players is 20!`);

    if (playersCount < 1)
        return message.channel.send(`The minimum amount of players is 1!`);

    try {
        const awaitedPlayers = await awaitPlayers(msg, playersCount);
        if (!awaitedPlayers) {
            return msg.channel.send("Game could not be started...");
        }

        const players = new Collection<string, { board: string[][], id: string, user: User }>();
        for (const player of awaitedPlayers) {
            players.set(player, {
                board: generateBoard(),
                id: player,
                user: await client.users.fetch(player),
            });
        }

        let winner = null;
        const called = ["FR"];
        while (!winner) {
            const validNums = callNums.filter((num) => !called.includes(String(num)));
            if (!validNums.length) {
                break;
            }

            const picked = validNums[Math.floor(Math.random() * validNums.length)];
            called.push(String(picked));

            for (const player of players.values()) {
                try {
                    await player.user.send(stripIndents`
							**${findRowValue(picked)} ${picked}** was called in ${msg.channel}.
							${generateBoardDisplay(player.board, called)}
						`);
                } catch {
                    await msg.channel.send(
                        `${player.user}, I couldn't send your board! Turn on DMs!`
                    );
                }
            }
            await msg.channel.send(stripIndents`
					**${findRowValue(picked)} ${picked}**!
					Check your DMs for your board. If you have bingo, type \`bingo\`!
					If you wish to drop out, type \`leave game\`.
					_Next number will be called in 20 seconds. ${
                validNums.length - 1
            } numbers left._
				`);
            const filter = (res) => {
                if (!players.has(res.author.id)) {
                    return false;
                }

                if (res.content.toLowerCase() === "leave game") {
                    players.delete(res.author.id);
                    client.utils.reactIfAble(res, res.author, SUCCESS_EMOJI_ID, "✅");
                    return !players.size;
                }

                if (res.content.toLowerCase() !== "bingo") {
                    return false;
                }

                if (!checkBingo(players.get(res.author.id).board, called)) {
                    msg.channel
                        .send(`${res.author}, you don't have bingo, liar.`)
                        .catch(() => null);

                    return false;
                }

                return true;
            };

            const bingo = await msg.channel.awaitMessages(filter, {
                max: 1,
                time: 20000,
            });

            if (!players.size) {
                winner = 0;
                break;
            }

            if (!bingo.size) {
                continue;
            }

            winner = bingo.first().author;
        }
        if (winner === 0) return msg.channel.send("Everyone dropped out...");
        if (!winner)
            return msg.channel.send(
                "I called the entire board, but no one called bingo..."
            );
        return msg.channel.send(`**Congrats,** ${winner} **has won the game!**`);
    } catch (err) {
        throw err;
    }
    
}

export const name: string = 'bingo';
export const category: string = 'Minigames';
export const description: string = 'Play a game of Bingo!';
export const userPerms: string[] = ['MANAGE_MESSAGES'];
export const botPerms: string[] = ['MANAGE_MESSAGES'];
export const modCommand: boolean = true;

function generateBoard(): string[][] {
    const result = [];
    for (const [rowID, values] of Object.entries(nums)) {
        const picked = [];
        for (let i = 0; i < 5; i++) {
            const valid = values.filter((value) => !picked.includes(value));
            picked.push(valid[Math.floor(Math.random() * valid.length)]);
        }

        const sorted = picked.sort((a, b) => a - b);
        if (rowID === "N") {
            sorted[2] = "FR";
        }

        result.push(sorted);
    }
    return result;
}

function generateBoardDisplay(board, called) {
    const mapped = board
        .map((values, i) => {
            const row = rows[i];
            const mapVal = values
                .map((value) => {
                    if (called.includes(value) || value === "FR") return "XX";
                    return value.toString().padStart(2, "0");
                })
                .join(" | ");
            return `${row} | ${mapVal}`;
        })
        .join("\n--------------------------\n");
    return stripIndents`
			\`\`\`
			${mapped}
			\`\`\`
		`;
}

function findRowValue(num) {
    if (nums.B.includes(num)) return "B";
    if (nums.I.includes(num)) return "I";
    if (nums.N.includes(num)) return "N";
    if (nums.G.includes(num)) return "G";
    if (nums.O.includes(num)) return "O";
    return null;
}

function checkLine(called, a, b, c, d, e) {
    return (
        called.includes(a) &&
        called.includes(b) &&
        called.includes(c) &&
        called.includes(d) &&
        called.includes(e)
    );
}

function checkBingo(bd, ca) {
    for (let r = 0; r < rows.length; r++) {
        if (checkLine(ca, bd[r][0], bd[r][1], bd[r][2], bd[r][3], bd[r][4]))
            return true;
    }
    for (let c = 0; c < rows.length; c++) {
        if (checkLine(ca, bd[0][c], bd[1][c], bd[2][c], bd[3][c], bd[4][c]))
            return true;
    }

    if (checkLine(ca, bd[0][0], bd[1][1], bd[2][2], bd[3][3], bd[4][4])) {
        return true;
    }

    return !!checkLine(ca, bd[4][0], bd[3][1], bd[2][2], bd[1][3], bd[0][4]);
}
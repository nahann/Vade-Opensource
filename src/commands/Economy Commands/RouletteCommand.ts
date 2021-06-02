import { RunFunction } from "../../interfaces/Command";
import ms from "ms";
import { Message, Util } from "discord.js";
import economySchema from "../../models/profile";
import util from "util";

export const run: RunFunction = async (client, message, args) => {
  const claims = [
    "red",
    "black",
    "1to12",
    "13to24",
    "25to36",
    "1to18",
    "19to36",
    "even",
    "odd",
    "00",
  ] as const;

  const wheel = [
    { number: "0", color: "green" },
    { number: "00", color: "green" },
    { number: "1", color: "red" },
    { number: "2", color: "black" },
    { number: "3", color: "red" },
    { number: "4", color: "black" },
    { number: "5", color: "red" },
    { number: "6", color: "black" },
    { number: "7", color: "red" },
    { number: "8", color: "black" },
    { number: "9", color: "red" },
    { number: "10", color: "black" },
    { number: "11", color: "black" },
    { number: "12", color: "red" },
    { number: "13", color: "black" },
    { number: "14", color: "red" },
    { number: "15", color: "black" },
    { number: "16", color: "red" },
    { number: "17", color: "black" },
    { number: "18", color: "red" },
    { number: "19", color: "red" },
    { number: "20", color: "black" },
    { number: "21", color: "red" },
    { number: "22", color: "black" },
    { number: "23", color: "red" },
    { number: "24", color: "black" },
    { number: "25", color: "red" },
    { number: "26", color: "black" },
    { number: "27", color: "red" },
    { number: "28", color: "black" },
    { number: "29", color: "black" },
    { number: "30", color: "red" },
    { number: "31", color: "black" },
    { number: "32", color: "red" },
    { number: "33", color: "black" },
    { number: "34", color: "red" },
    { number: "35", color: "black" },
    { number: "36", color: "red" },
  ] as const;

  const rewards: Record<typeof claims[number], number> = {
    "00": 2.5,
    "13to24": 1.75,
    "19to36": 1.25,
    "1to12": 1.5,
    "1to18": 1.25,
    "25to36": 1.75,
    black: 1.5,
    even: 1.5,
    odd: 1.5,
    red: 1.5,
  };

  const players = new Map<
    string,
    {
      bet: number;
      number: number | typeof claims[number];
    }[]
  >();

  const joining = message.channel.createMessageCollector(
    (msg) => msg.content.trim().startsWith("bet"),
    {
      time: ms(args[0] ?? "15s"),
    }
  );

  joining.on("collect", async (msg: Message) => {
    const [strBet, strNum] = msg.content
      .trim()
      .slice("bet".length)
      .trim()
      .split(/\s+/);

    const bet = parseInt(strBet);
    const number = (
      claims.includes(strNum as typeof claims[number])
        ? strNum
        : parseInt(strNum)
    ) as number | typeof claims[number];

    console.log(number);

    // Also check if the player has enough currency.

    if (!bet || bet < 0)
      return msg.channel.send(
        `Sorry <@!${msg.author.id}>, your bet should be a positive integer!`
      );
    let schema = await economySchema.findOne({ User: msg.author.id });
    if (!schema || schema?.Wallet < bet)
      return msg.channel.send(
        `Sorry <@!${msg.author.id}>, you do not have enough to bet that amount.`
      );

    if (
      typeof number === "undefined" ||
      (typeof number === "number" && (number < 0 || number > 36)) ||
      (typeof number !== "number" &&
        !claims.includes(number as typeof claims[number]))
    )
      return msg.channel.send(
        `Sorry <@!${msg.author.id}>, your claim is not valid!`
      );

    const player = players.get(message.author.id);
    console.log(`PLAYER: ` + util.inspect(player));

    if (player) {
      if (player.length >= 3)
        return message.channel.send(
          `Sorry <@!${msg.author.id}>, you already have 3 bets!`
        );

      player.push({ bet, number });
    } else players.set(message.author.id, [{ bet, number }]);

    return message.channel.send(
      `You entered a new bet for \`${bet}\` on \`${number}\`!`
    );
  });

  const toEdit = await message.channel.send(
    `<@!${message.author.id}> has started a roulette round! Type \`bet\` followed by your bet and claim to join!`
  );

  await new Promise((resolve, reject) => joining.on("end", resolve));

  console.log(players, players.size);

  if (players.size < 1) return message.channel.send(`No one joined.`);

  await toEdit.edit(
    `**Participants:**\n${[...players.keys()]
      .map((id) => `<@!${id}>`)
      .join("\n")}\nSpinning the wheel...`
  );

  await new Promise((resolve, reject) =>
    setTimeout(resolve, Math.random() * 15000 + 15000)
  );
  // await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  const landed = wheel[Math.floor(Math.random() * wheel.length)];

  const won = [...players.entries()]
    .map(([id, bets]) => {
      const results: {
        bet: number;
        number: number | typeof claims[number];
        won: boolean;
      }[] = [];

      loop: for (const bet of bets) {
        const { number } = bet;

        let won = false;

        if (typeof number === "number") {
          if (parseInt(landed.number) === number) {
            won = true;
            break;
          }
        }

        if (landed.number === number) {
          won = true;
          break;
        }

        const num = parseInt(landed.number);

        switch (number) {
          case "red":
            won = landed.color === "red";
            break loop;
          case "black":
            won = landed.color === "black";
            break loop;
          case "even":
            won = num % 2 === 0;
            break loop;
          case "odd":
            won = num % 2 !== 0;
            break loop;
          case "13to24":
            won = num >= 13 && num <= 24;
            break loop;
          case "19to36":
            won = num >= 19 && num <= 36;
            break loop;
          case "1to12":
            won = num >= 1 && num <= 12;
            break loop;
          case "1to18":
            won = num >= 1 && num <= 18;
            break loop;
          case "25to36":
            won = num >= 25 && num <= 36;
            break loop;
        }

        results.push({ ...bet, won });
      }

      return [id, results];
    })
    .map((el) => {
      const [id, bets] = el as [
        string,
        {
          bet: number;
          number: number | typeof claims[number];
          won: boolean;
        }[]
      ];

      const reward = bets.reduce((reward, { bet, number, won }) => {
        return won
          ? reward +
              (typeof number === "number"
                ? 2.5 * reward
                : rewards[number] * reward)
          : -reward;
      }, 0);

      return {
        id,
        reward,
      };
    });

  // Use `won` to distribute rewards. It is an array of user ID's and their payout (can be negative).

  toEdit.edit(
    `The ball landed on \`${landed.number}\`!\n\n**__Winners__**${
      won
        .filter(({ reward }) => reward > 0)
        .map(({ id }) => `<@!${id}>`)
        .join("\n") || `\n\nNo winners`
    }`
  );

  won.forEach(async ({ id, reward }) => {
    message.channel.send(id);

    console.log(`ID: ` + id);
    console.log(`Reward: ` + reward);

    let locate_schema = await economySchema.findOne({ User: id });
    if (locate_schema) {
      await locate_schema.updateOne({
        $inc: { Wallet: reward },
      });
    } else if (reward > 0) {
      const newSchema = new economySchema({
        Wallet: reward,
        Bank: 0,
      });

      await newSchema.save();
    }
  });
};
export const name: string = "roulette";
export const category: string = "Economy";
export const description: string =
  "Play a game of roulette and have a chance at big winnings!";

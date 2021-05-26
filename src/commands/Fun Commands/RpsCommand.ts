import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  let embed = new client.embed()
    .setTitle("RPS GAME")
    .setDescription("React with your choice!")
    .setTimestamp()
    .setColor("FD0404");
  let msg = await message.channel.send(embed);
  await msg.react("🗻");
  await msg.react("✂");
  await msg.react("📰");

  const filter = (reaction, user) => {
    return (
      ["🗻", "✂", "📰"].includes(reaction.emoji.name) &&
      user.id === message.author.id
    );
  };

  const choices = ["🗻", "✂", "📰"];
  const me = choices[Math.floor(Math.random() * choices.length)];
  msg
    .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
    .then(async (collected) => {
      const reaction = collected.first();
      let result = new client.embed()
        .setTitle("Results")
        .addField("Your Choice", `${reaction.emoji.name}`)
        .addField("My Choice", `${me}`)
        .setColor("FD0404");
      await msg.edit(result);
      if (
        (me === "🗻" && reaction.emoji.name === "✂") ||
        (me === "📰" && reaction.emoji.name === "🗻") ||
        (me === "✂" && reaction.emoji.name === "📰")
      ) {
        message.reply("You lost.");
      } else if (me === reaction.emoji.name) {
        return message.reply("It was a tie!");
      } else {
        return message.reply("You won!");
      }
    })
    .catch((collected) => {
      message.reply(
        `The game has been cancelled because you failed to respond in time!`
      );
    });
};
export const name: string = "rockpaperscissors";
export const category: string = "Fun";
export const description: string =
  "Play a game of Rock Paper Scissors with the Bot!";
export const aliases: string[] = ["rps"];

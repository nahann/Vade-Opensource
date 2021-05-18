import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  if (!args[0])
    return client.utils.sendError(
      `You need to specify either "rock", "paper" or "scissors".`,
      message.channel
    );

  if (
    args[0].includes("paper") ||
    args[0].includes("rock") ||
    args[0].includes("scissors")
  ) {
    // Bot decision time
    const choices = ["rock", "paper", "scissors"];
    const choice = choices[Math.floor(Math.random() * choices.length)];
    let winner;
    if (choice == args[0]) {
      winner = "no one";
    } else if (
      (choice == "rock" && args[0] == "scissors") ||
      (choice == "paper" && args[0] == "rock") ||
      (choice == "scissors" && args[0] == "paper")
    ) {
      winner = "bot";
    } else {
      winner = "user";
    }
    const embed = new client.embed().setTitle("Rock Paper Scissors")
      .setDescription(`**You choose:** ${args[0]}
      **I choose:** ${choice}\n
      Result: ${winner} has win`);
    message.channel.send(embed);
  } else {
    return client.utils.sendError(
      `You need to specify either "rock", "paper" or "scissors".`,
      message.channel
    );
  }
};
export const name: string = "rockpaperscissors";
export const description: string = 'Play a game of "Rock Paper Scissors".';
export const aliases: string[] = ["rps"];

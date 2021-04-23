import { RunFunction } from "../../interfaces/Command";

const answers: string[] = [
  "Maybe.",
  "Certainly Not.",
  "I hope so.",
  "Not in your wildest dreams.",
  "There is a good chance.",
  "Quite likely.",
  "I think so.",
  "I hope so.",
  "I hope not.",
  "Never!",
  "Forget about it.",
  "Ahaha really!?",
  "Pfft.",
  "Sorry, bucko.",
  "Hell, yes.",
  "Hell to the no.",
  "The future is bleak.",
  "The future is uncertain.",
  "I would rather not say.",
  "Who cares?",
  "Possibly.",
  "Never, ever, ever.",
  "There is a small chance.",
  "Yes!",
];

export const run: RunFunction = async (client, message, args) => {
  const question = args.join(" ");
  return message.reply(
    question.endsWith("?")
      ? `🎱 ${answers[Math.floor(Math.random() * answers.length)]}`
      : "🎱 That doesn't seem to be a question, please try again."
  );
};
export const name: string = "8ball";
export const category: string = "Fun";
export const description: string = "Yes.";
export const aliases: string[] = ["ball8"];

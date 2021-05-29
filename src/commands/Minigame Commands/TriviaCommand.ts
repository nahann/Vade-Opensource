import { stripIndents } from 'common-tags';
import { Collection, User } from 'discord.js-light';
import { promisify } from "util";
import phin from "phin";

import type { RunFunction } from '../../interfaces/Command';

const SUCCESS_EMOJI_ID = "817905283547267122";
const choices = ["A", "B", "C", "D"];
const delay = promisify(setTimeout);

export const run: RunFunction = async(client, message, args) => {


    const awaitPlayers = client.utils.awaitPlayers.bind(client.utils);
    const reactIfAble = client.utils.reactIfAble.bind(client.utils);

    if (!args[0])
        return message.channel.send(`Please specify an amount of players.`);

    const players = parseInt(args[0]);
    if (isNaN(players))
        return message.channel.send(`You must provide a number!`);

    if (players > 100)
        return message.channel.send(`The maximum amount of players is 100!`);

    if (players < 1)
        return message.channel.send(`The minimum amount of players is 1!`);

    try {
        const awaitedPlayers = await awaitPlayers(message, players);
        let turn = 0;
        const pts = new Collection<string, { points: number, id: string, user: User }>();
        for (const player of awaitedPlayers) {
            pts.set(player, {
                points: 0,
                id: player,
                user: await client.users.fetch(player),
            });
        }
        const questions = await fetchQuestions();
        let lastTurnTimeout = false;
        while (questions.length) {
            ++turn;
            const question = questions[0];
            questions.shift();
            await message.channel.send(stripIndents`
					**${turn}. ${question.category}**
					${question.question}
					${question.answers
                .map((answer, i) => `**${choices[i]}.** ${answer}`)
                .join("\n")}
				`);
            const filter = (res) => {
                if (!awaitedPlayers.includes(res.author.id)) return false;
                const answer = res.content.toUpperCase();
                if (choices.includes(answer)) {
                    reactIfAble(res, res.author, SUCCESS_EMOJI_ID, "✅");
                    return true;
                }
                return false;
            };
            const messages = await message.channel.awaitMessages(filter, {
                max: pts.size,
                time: 30000,
            });
            if (!messages.size) {
                await message.channel.send(
                    `No answers? Well, it was **${question.correct}**.`
                );
                if (lastTurnTimeout) {
                    break;
                } else {
                    lastTurnTimeout = true;
                    continue;
                }
            }
            const answers = messages.map((res) => {
                const choice = choices.indexOf(res.content.toUpperCase());
                return {
                    answer: question.answers[choice],
                    id: res.author.id,
                };
            });

            const correct = answers.filter(
                (answer) => answer.answer === question.correct
            );

            for (const answer of correct) {
                const player = pts.get(answer.id);
                if (correct[0].id === answer.id) {
                    player.points += 75;
                } else {
                    player.points += 50;
                }
            }

            await message.channel.send(stripIndents`
					It was... **${question.correct}**!
					_Fastest Guess: ${
                correct.length
                    ? `${pts.get(correct[0].id).user.tag} (+75 pts)`
                    : "No One..."
            }_
					${questions.length ? "_Next round starting in 5 seconds..._" : ""}
				`);
            if (lastTurnTimeout) lastTurnTimeout = false;
            if (questions.length) await delay(5000);
        }
        const winner = pts.sort((a, b) => b.points - a.points).first().user;
        return message.channel.send(stripIndents`
				Congrats, ${winner}!
				__**Top 10:**__
				${makeLeaderboard(pts).slice(0, 10).join("\n")}
			`);
    } catch (err) {
        throw err;
    }
}




export const name: string = 'trivia';
export const category: string = 'Minigames';
export const description: string = 'Play a game of trivia!';
export const aliases: string[] = ['quiz'];

function makeLeaderboard(pts) {
    let i = 0;
    let previousPts = null;
    let positionsMoved = 1;
    return pts
        .sort((a, b) => b.points - a.points)
        .map((player) => {
            if (previousPts === player.points) {
                positionsMoved++;
            } else {
                i += positionsMoved;
                positionsMoved = 1;
            }
            previousPts = player.points;
            return `**${i}.** ${player.user.tag} (${player.points} Point${
                player.points === 1 ? "" : "s"
            })`;
        });

}

async function fetchQuestions() {
    const { body } = await phin<RawResponse<"multiple">>({
        url: "https://opentdb.com/api.php?amount=7&type=multiple&encode=url3986",
        parse: "json"
    })

    if (!body.results) return this.fetchQuestions();
    const questions = body.results;
    return questions.map((question) => {
        const answers = question.incorrect_answers.map((answer) => decodeURIComponent(answer.toLowerCase()));
        const correct = decodeURIComponent(question.correct_answer.toLowerCase());

        answers.push(correct);
        return {
            question: decodeURIComponent(question.question),
            category: decodeURIComponent(question.category),
            answers: shuffle(answers),
            correct,
        };
    });
}

function shuffle(array: Array<string>) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

/* unions */
type Type = "multiple" | "boolean";
type Difficulty = "easy" | "medium" | "hard";
type BooleanAnswers = "True" | "False";

/* raw results */
interface RawResponse<T extends Type> {
    response_code: number;
    results: RawResult<T>[];
}

interface RawResult<T extends Type> {
    category: string;
    type: T;
    difficulty: Difficulty;
    question: string;
    correct_answer: T extends "multiple" ? string : BooleanAnswers;
    incorrect_answers: T extends "multiple" ? string[] : [BooleanAnswers];
}


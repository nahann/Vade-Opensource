import { RunFunction } from '../../interfaces/Command';
import stripIndents from 'common-tags';
import request from 'node-superfetch';
const choices = ['1', '2'];

   export const run: RunFunction = async(client, message, _args) => {

    const msg = message;

    const formatNumber = client.utils.formatNumber;

    try {
      const data = await fetchScenario();
      await msg.channel.send(stripIndents`
				${data.prefix ? `${data.prefix}, would you rather...` : "Would you rather..."}
				**1.** ${data.option_1}
				**2.** ${data.option_2}
				_Respond with either **1** or **2** to continue._
			`);
      const filter = (res) =>
        res.author.id === msg.author.id &&
        choices.includes(res.content.toLowerCase());
      const msgs = await msg.channel.awaitMessages(filter, {
        time: 30000,
        max: 1,
      });
      if (!msgs.size) {
        return msg.reply(stripIndents`
					No response? Too bad.
					${formatNumber(data.option1_total)} - ${formatNumber(data.option2_total)}
				`);
      }
      const option1 = msgs.first().content.toLowerCase() === "1";
      await postResponse(data.id, option1);
      const totalVotes =
        Number.parseInt(data.option1_total, 10) +
        Number.parseInt(data.option2_total, 10);
      const numToUse = option1
        ? Number.parseInt(data.option1_total, 10)
        : Number.parseInt(data.option2_total, 10);
      return msg.reply(stripIndents`
				**${Math.round((numToUse / totalVotes) * 100)}%** of people agree!
				${formatNumber(data.option1_total)} - ${formatNumber(data.option2_total)}
			`);
    } catch (err) {
      return msg.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  
    async function fetchScenario() {
        const { text } = await request.get("http://either.io/");
        return JSON.parse(text.match(/window.initial_question = (\{.+\})/)[1])
          .question;
      }
    
      async function postResponse(id, bool) {
        try {
          const { text } = await request
            .get(`http://either.io/vote/${id}/${bool ? "1" : "2"}`)
            .set({ "X-Requested-With": "XMLHttpRequest" });
          return JSON.parse(text).result;
        } catch {
          return false;
        }
    
        }


}
export const name: string = 'wouldyourather';
export const category: string = 'Fun';
export const description: string = 'Take part n a tiny minigame of would you rather!';
export const aliases: string[] = ['wyr'];



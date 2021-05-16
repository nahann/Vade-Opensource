import { lang } from 'moment';
import { promisify } from 'util';
import { RunFunction } from '../../interfaces/Command';
import ProfileSchema from '../../models/profile';
const wait = promisify(setTimeout);

   export const run: RunFunction = async(client, message, args, lang) => {

    const bet = parseInt(args[0]);

    const nf = Intl.NumberFormat();

    const profile = await ProfileSchema.findOne({ User: message.author.id });
    if(!profile || !profile.Wallet || profile.Wallet < bet) return client.utils.sendError(client.translate({ locale: lang, phrase: 'slots.notEnough'}), message.channel);
    const checkPremium = await client.utils.checkPremium(message.author.id);
    const max = checkPremium ? 1000000 : 250000;
    const min = checkPremium ? 1000 : 2000;

    if (bet > max) return client.utils.sendError(`${client.translate({ locale: lang, phrase: 'slots.higherBet'})}: $${nf.format(max)}`, message.channel);
    if (!bet || bet < min) return client.utils.sendError(`${client.translate({ locale: lang, phrase: 'slots.lowerBet'})}: $${nf.format(min)}!`, message.channel);


    const emojis: Array<string> = ["🍋", "🍎", "🍇", "🍀", "💎", "🍍", "🍒", "🍊"];

    const slots = [];

    const embed = new client.embed()
      .setDescription(`-- SPINNING --`)
      .setMainColor()
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter(`Vade Economy System`);

    const gameMessage = await message.channel.send(embed);
    for (let i = 0; i < 3; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      slots.push(emoji);

      embed.setDescription(slots.join("  |  "));

      if (i !== 3) {
        await wait(3000);
      }
      gameMessage.edit(embed);
    }

    let profit = 0;
    if (slots[0] === slots[1] && slots[0] === slots[2]) {
      profit = bet * 1.9;
    } else if (slots[0] === slots[1]) {
      profit = bet * 1.3;
    } else if (slots[0] === slots[2]) {
      profit = bet * 0.5;
    }

    if (profit === 0) {
      await profile.updateOne({
          $inc: { Wallet: -bet }
      });
      
      // client.utils.removeBal(message.author.id, bet);
    } else {
        await profile.updateOne({
            $inc: { Wallet: profit }
        });
    }


    let amount = checkPremium ? profit * 1.35 : profit;
    const endEmbed = new client.embed()
      .setDescription(
        `Amount ${amount === 0 ? "lost" : "won"}: ${
          amount === 0 ? `$${nf.format(bet)}` : `$${nf.format(profit)}`
        }`
      )
      .addField(client.translate({ locale: lang, phrase: 'slots.newBal'}), `$${nf.format(profit ? profile.Wallet + profit : profile.Wallet - bet)}`)
      .addField("\u200b", `>> ${slots.join("  |  ")} <<`)
      amount === 0 ? endEmbed.setErrorColor() : endEmbed.setSuccessColor()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp()
      .setFooter("Vade Economy System");
    gameMessage.edit(endEmbed);
  }

export const name: string = 'slots';
export const category: string = 'Economy';
export const description: string = 'Play a game of slots!';
export const aliases: string[] = ['slotsmachine', 'gamble'];

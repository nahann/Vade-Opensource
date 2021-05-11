import { RunFunction } from "../../interfaces/Command";
import { Paginate } from "@the-nerd-cave/paginate";
import paginationEmbed from "discord.js-pagination";
import economy from "../../../src/models/economy";
import ms from "ms";

export const run: RunFunction = async (client, message, args) => {
  if (message.channel.type !== "text") return;

  const Wages = {
    "Rocket Scientist": 15000,
    Programmer: 12000,
    Scientist: 5000,
    Cleaner: 2000,
    Beggar: 1000,
    "Discord Moderator": 7500,
    "Discord Bug Hunter": 5000,
    Model: 4500,
    Gamer: 2000,
  };

  const Jobs = [
    "Rocket Scientist",
    "Programmer",
    "Scientist",
    "Cleaner",
    "Beggar",
    "Discord Moderator",
    "Discord Bug Hunter",
    "Model",
    "Gamer",
  ];

  const economySchema = await economy.findOne({ User: message.author.id });

  if (!args.length) {
    const nf = Intl.NumberFormat();

    const commandsToPaginate = Jobs.map(
      (j) => `${j}\n Salary: $${nf.format(Wages[j]) ?? `2,000`}\n`
    );
    const pages = new Paginate(commandsToPaginate, 8).getPaginatedArray();

    const embeds = pages.map((page, index) => {
      return new client.embed()
        .setTitle(`Available Jobs`)
        .setDescription(
          page || `No more Jobs to be listed on page ${index + 1}`
        )
        .setClear()
        .setTimestamp()
        .setThumbnail(message.guild.iconURL());
    });

    let emojiList = ["◀️", "▶️"];
    return paginationEmbed(message, embeds, emojiList, 60 * 1000);
  }

  if (economySchema && economySchema.JobSwitchTime > Date.now() + ms("7d"))
    return message.channel.send(
      `You can switch jobs again in ${
        (ms(economySchema.JobSwitchTime), { long: true })
      }`
    );

  const selected = args.join(" ");
  const premiumCheck = await client.utils.checkPremium(message.author.id);
  const checked = Jobs.includes(client.utils.capitalise(selected));
  if (!checked)
    return message.channel.send(
      `That is not a valid job. Please run \`!job\` on it's own to view a list of available jobs.`
    );
  const wage = Wages[client.utils.capitalise(selected)];
  const premCheck = wage >= 15000;
  if (premCheck && !premiumCheck)
    return message.channel.send(
      `Jobs with a salary of over 15,000 require you to have Vade Premium!`
    );
  const succEmbed = client.utils.succEmbed;
  if (!economySchema) {
    const newSchema = new economy({
      Wallet: 0,
      Bank: 0,
      Job: client.utils.capitalise(selected),
      Wage: wage,
    });

    await newSchema.save();

    return succEmbed(
      `Successfully set your Job to ${client.utils.capitalise(selected)}!`,
      message.channel
    );
  }

  await economySchema.updateOne({
    Job: client.utils.capitalise(selected),
    Wage: wage,
  });

  return succEmbed(
    `Successfully set your Job to ${client.utils.capitalise(selected)}!`,
    message.channel
  );
};
export const name: string = "job";
export const category: string = "Economy";
export const description: string = "Select a Job and start earning a living!";
export const aliases: string[] = ["jobselect", "selectjob"];

import { RunFunction } from '../../interfaces/Command';
import fetch from 'node-fetch';

export const run: RunFunction = async(client, message, args) => {

    const option = args[0];

    let mainEmbed = new client.embed()
        .setFooter(
            `Requested by ${message.member.displayName}`,
            message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    switch (option) {
        case "random":
            const randomFact = await fetch(
                "https://uselessfacts.jsph.pl/random.json?language=en"
            ).then((response) => response.json());

            mainEmbed
                .setTitle("Random fact!")
                .setDescription(`\`\`\`${randomFact.text}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        case "bird":
            const birdRes = await fetch("https://some-random-api.ml/facts/bird");
            const birdFact = (await birdRes.json()).fact;

            mainEmbed
                .setTitle(`Bird Fact`)
                .setDescription(`\`\`\`${birdFact}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        case "dog":
            const dogRes = await fetch("https://some-random-api.ml/facts/dog");
            const dogFact = (await dogRes.json()).fact;

            mainEmbed.setTitle(`Dog Fact`).setDescription(`\`\`\`${dogFact}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        case "cat":
            const catRes = await fetch("https://some-random-api.ml/facts/cat");
            const catFact = (await catRes.json()).fact;

            mainEmbed.setTitle(`Cat Fact`).setDescription(`\`\`\`${catFact}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        case "panda":
            const pandaRes = await fetch("https://some-random-api.ml/facts/panda");
            const pandaFact = (await pandaRes.json()).fact;

            mainEmbed
                .setTitle(`Panda Fact`)
                .setDescription(`\`\`\`${pandaFact}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        case "koala":
            const koalaRes = await fetch("https://some-random-api.ml/facts/koala");
            const koalaFact = (await koalaRes.json()).fact;

            mainEmbed
                .setTitle(`Koala Fact`)
                .setDescription(`\`\`\`${koalaFact}\`\`\``);

            message.channel.send(mainEmbed);

            break;

        default:
            const random = await fetch(
                "https://uselessfacts.jsph.pl/random.json?language=en"
            ).then((response) => response.json());

            mainEmbed
                .setTitle("Random fact!")
                .setDescription(`\`\`\`${random.text}\`\`\``);

            message.channel.send(mainEmbed);
    }

}

export const name: string = 'fact';
export const category: string = 'Information';
export const description: string = 'Get a random fact!';
export const aliases: string[] = ['information'];
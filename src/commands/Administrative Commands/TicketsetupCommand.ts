import type { RunFunction } from '../../interfaces/Command';
import TicketData from '../../models/GuildConfig/TicketSchema';
import { MessageCollector } from 'discord.js-light';


export const run: RunFunction = async(client, message, _args) => {

    if(message.channel.type !== 'text') return;

    let ticketData = await TicketData.findOne({ GuildID: message.guild.id });
    if (!message.member.hasPermission("MANAGE_GUILD")) {
        return message.channel.send(
            "You are missing permissions! You must have the **MANAGE_SERVER** permission."
        );
    }

    if (!ticketData) {
        const firstEmbed = new client.embed()
            .setTitle("Ticket System Setup")
            .setDescription("What do you want the embed description to be?")
            .setColor("BLUE");
        await message.channel.send(firstEmbed);

        const firstFilter = (m) => m.author.id === message.author.id;
        const firstCollector = new MessageCollector(
            message.channel,
            firstFilter,
            { max: 2 }
        );

        let embedDescription;

        firstCollector.on("collect", async (msg) => {
            embedDescription = msg.content;
            const secondEmbed = new client.embed()
                .setTitle("Ticket System Setup")
                .setDescription(
                    "Where do you want to send the message? Please mention a channel."
                )
                .setColor("BLUE");
            msg.channel.send(secondEmbed);
            firstCollector.stop();

            const secondFilter = (m) => m.author.id === message.author.id;
            const secondCollector = new MessageCollector(
                // @ts-ignore
                message.channel,
                secondFilter,
                { max: 2 }
            );

            secondCollector.on("collect", async (msg) => {
                let embedChannel = msg.mentions.channels.first();
                if (!embedChannel) {
                    msg.channel.send("That is not a valid channel! Please try again.");
                    secondCollector.stop();
                    return;
                }

                const thirdEmbed = new client.embed()
                    .setTitle("Ticket System Setup")
                    .setDescription(
                        "What roles do you want to have access to see tickets? Please provide a role name, mention, or ID."
                    )
                    .setColor("BLUE");
                msg.channel.send(thirdEmbed);
                secondCollector.stop();

                const thirdFilter = (m) => m.author.id === message.author.id;
                const thirdCollector = new MessageCollector(
                    // @ts-ignore
                    message.channel,
                    thirdFilter,
                    { max: 2 }
                );

                thirdCollector.on("collect", async (message) => {
                    let savedRole =
                        message.mentions.roles.first() ||
                        message.guild.roles.cache.get(message.content) ||
                        message.guild.roles.cache.find(
                            (role) =>
                                role.name.toLowerCase() === message.content.toLowerCase()
                        );

                    if (!savedRole) {
                        msg.channel.send("That is not a valid role! Please try again.");
                        thirdCollector.stop();
                        return;
                    }

                    const fourthEmbed = new client.embed()
                        .setTitle("Ticket System Setup")
                        .setDescription("The setup is now finished!")
                        .setColor("BLUE");
                    await msg.channel.send(fourthEmbed);
                    thirdCollector.stop();

                    await createTicketSystem(
                        client,
                        ticketData,
                        embedDescription,
                        embedChannel,
                        message,
                        savedRole
                    );
                });
            });
        });
    } else {
        await TicketData.findOneAndRemove({
            GuildID: message.guild.id,
        });
        message.channel.send(
            `**Successfuly Reset the Ticket System in this Server!**\nRun this Command again to re-configure the Ticket System for this Guild!`
        );
    }



}

export const name: string = 'ticket-setup';
export const category: string = 'Administrative';
export const description: string = 'Configure the servers ticket system.';
export const aliases: string[] = ['ticketsetup'];
export const userPerms: string[] = ['MANAGE_GUILD'];
export const botPerms: string[] = ['MANAGE_CHANNELS'];

async function createTicketSystem(
    client,
    _ticketData,
    embedDescription,
    embedChannel,
    message,
    savedRole
) {
    const sendEmbed = new client.embed()
        .setTitle("Ticket")
        .setDescription(embedDescription)
        .setColor("BLUE");

    let msg = await embedChannel.send(sendEmbed);
    await msg.react("🎟");

    const newData = new TicketData({
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id,
    });
    newData.save();
}
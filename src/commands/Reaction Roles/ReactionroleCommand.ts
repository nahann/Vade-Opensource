import { Message, TextChannel } from "discord.js";
import { RunFunction } from "../../interfaces/Command";

export const run: RunFunction = async (client, message, args) => {
  const cancelledEmbed = client.utils.succEmbed;
  const cancelledEmbed2 = client.utils.sendError;
  const sendError = client.utils.sendError;

  const filter = (m) => m.author.id === message.author.id;

  message.channel
    .send(
      "Please specify a channel! **[channel / ID]**\n\nType `cancel` to cancel this prompt."
    )
    .then(() => {
      message.channel
        .awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
        .then(async (collected) => {
          let channel = collected?.first().content;
          if (channel.toLowerCase() === "cancel") {
            cancelledEmbed(
              `Successfully cancelled the prompt!`,
              message.channel
            );
            return;
          }
          let channelToSend = client.utils.getChannels(
            channel,
            message.guild
          ) as TextChannel;

          if (!channelToSend)
            return cancelledEmbed2(
              `Wrong response! Cancelling the prompt!`,
              message.channel
            );

          message.channel
            .send(
              `Provide me with a message ID\n\nMake sure the message is in ${channelToSend}\n\nType \`cancel\` to cancel this prompt.`
            )
            .then(() => {
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                })
                .then(async (collected1) => {
                  let ID = collected1.first().content;
                  if (ID.toLowerCase() === "cancel") {
                    cancelledEmbed;
                    return;
                  }
                  let messageID = (await channelToSend.messages
                    .fetch(ID)
                    .catch(() => {
                      return cancelledEmbed2(
                        `Wrong response! Cancelling the prompt!`,
                        message.channel
                      );
                    })) as Message;

                  message.channel
                    .send(
                      "Please provide me with a role **[Role / ID]**\n\nThe following Role will be given when the user reacts!\n\nType `cancel` to cancel this prompt."
                    )
                    .then(() => {
                      message.channel
                        .awaitMessages(filter, {
                          max: 1,
                          time: 60000,
                          errors: ["time"],
                        })
                        .then(async (collected2) => {
                          let roleName = collected2.first().content;
                          let role = client.utils.getRoles(
                            roleName,
                            message.guild
                          );
                          if (roleName.toLowerCase() === "cancel") {
                            cancelledEmbed;
                            return;
                          }
                          if (!role)
                            return cancelledEmbed2(
                              `Wrong response! Cancelling the prompt!`,
                              message.channel
                            );
                          if (role.managed) {
                            return message.channel.send(
                              `Please do not use a integration role.`
                            );
                          }

                          message.channel
                            .send(
                              "Now Please Provide me with an Emoji, make sure its not a custom One!\n\nThe Following Emoji will be the emoji that the user will react to!\n\nType `cancel` to cancel this prompt."
                            )
                            .then(() => {
                              message.channel
                                .awaitMessages(filter, {
                                  max: 1,
                                  time: 60000,
                                  errors: ["time"],
                                })
                                .then(async (collected3) => {
                                  let emoji = collected3.first().content;

                                  if (!emoji)
                                    return sendError(
                                      `Provide me with a valid Emoji`,
                                      message.channel
                                    );

                                  if (isCustomEmoji(emoji))
                                    return sendError(
                                      `You may not use custom emojis.`,
                                      message.channel
                                    );

                                  try {
                                    await messageID.react(emoji);
                                  } catch (err) {
                                    return message.channel.send(
                                      new client.embed()
                                        .setAuthor(
                                          message.author.tag,
                                          message.author.displayAvatarURL()
                                        )
                                        .setDescription(
                                          ` Please Provide a valid Emoji.`
                                        )
                                        .setErrorColor()
                                    );
                                  }
                                  message.channel
                                    .send(
                                      "__**Finally Pick:**__\n\n`1` - React adds the role, unreacting removes the role\n`2`- Reacting will give the role but unreaction won't remove the role\n`3` - Reacting will remove the user's role and unreacting won't give it back\n`4` - When reacting it will remove the role, unreacting will add the role\n`5` - Same concept as number 3 but removes the user's reaction\n`6` - React to recieve the role and react again to remove the role"
                                    )
                                    .then(() => {
                                      message.channel
                                        .awaitMessages(filter, {
                                          max: 1,
                                          time: 60000,
                                          errors: ["time"],
                                        })
                                        .then((collected4) => {
                                          let option = collected4.first()
                                            .content;
                                          let numbers = [
                                            "1",
                                            "2",
                                            "3",
                                            "4",
                                            "5",
                                            "6",
                                          ];
                                          if (!numbers.includes(option))
                                            return message.channel.send(
                                              "You must specify between 1, 2, 3, 4 or 5"
                                            );

                                          message.channel
                                            .send(
                                              new client.embed()
                                                .setAuthor(
                                                  "Reaction Roles - Setup Done",
                                                  message.guild.iconURL(),
                                                  messageID.url
                                                )
                                                .setSuccessColor()
                                                .addField(
                                                  "Channel",
                                                  channelToSend,
                                                  true
                                                )
                                                .addField("Emoji", emoji, true)
                                                .addField("Type", option, true)
                                                .addField(
                                                  "Message ID",
                                                  ID,
                                                  true
                                                )
                                                .addField(
                                                  "Message",
                                                  `[Jump To Message](${messageID.url})`,
                                                  true
                                                )
                                                .addField("Role", role, true)
                                            )
                                            .then(async () => {
                                              messageID.react(emoji);

                                              await client.utils.reactionCreate(
                                                message.guild.id,
                                                ID,
                                                role.id,
                                                emoji,
                                                false,
                                                parseInt(option)
                                              ); //ID is MessageID, ignore "false"
                                            });
                                        })
                                        .catch((err) => {
                                          if (err)
                                            sendError(
                                              `Time has expired! Please run the Command again!`,
                                              message.channel
                                            );
                                        });
                                    });
                                })
                                .catch((err) => {
                                  if (err)
                                    sendError(
                                      `Time has expired! Please run the Command again!`,
                                      message.channel
                                    );
                                });
                            });
                        })
                        .catch((err) => {
                          if (err)
                            sendError(
                              `Time has expired! Please run the Command again!`,
                              message.channel
                            );
                        });
                    });
                })
                .catch((err) => {
                  if (err)
                    sendError(
                      `Time has expired! Please run the Command again!`,
                      message.channel
                    );
                  console.log(err);
                });
            });
        })
        .catch((err) => {
          if (err)
            sendError(
              `Time has expired! Please run the Command again!`,
              message.channel
            );
        });
    });
};
export const name: string = "reactionrole";
export const category: string = "Reaction Roles";
export const description: string =
  "Setup reaction roles with the types included.";
export const aliases: string[] = ["rrsetup", "reactionsetup", "rr"];
export const userPerms: string[] = ["MANAGE_ROLES"];
export const botPerms: string[] = ["MANAGE_ROLES"];

function isCustomEmoji(emoji) {
  return emoji.split(":").length == 1 ? false : true;
}

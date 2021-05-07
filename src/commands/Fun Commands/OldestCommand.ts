import { RunFunction } from '../../interfaces/Command';

   export const run: RunFunction = async(client, message, args) => {

    const formatDate = client.utils.formatDate;

    const fetch = await message.guild.members.fetch()
    let mem = fetch
    .filter((m) => !m.user.bot)
    // @ts-ignore
    .sort((a, b) => a.user.createdAt - b.user.createdAt)
    .first()

  const Embed = new client.embed()
    .setTitle(`The odest member in ${message.guild.name}`)
    .setClear()
    .setFooter(`Date format: MM/DD/YYYY`)
    .setDescription(
      `**${mem.user.tag}** is the oldest user in ${
        message.guild.name
      }! Account creation date: **${formatDate(mem.user.createdAt)}**`
    )
    .setTimestamp()
    .setThumbnail(message.guild.iconURL());
  message.channel.send(Embed);

    }
export const name: string = 'oldest';
export const category: string = 'Fun';
export const description: string = 'Find out who has the oldest account in the current server.';
export const aliases: string[] = ['old'];

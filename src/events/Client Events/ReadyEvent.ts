import { RunFunction } from "../../interfaces/Event";
import SlashCommandManager from "../../Classes/SlashCommandManager";
import { Guild, TextChannel, User, VoiceChannel } from "discord.js-light";
import { Manager } from "erela.js";
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";

export const run: RunFunction = async (client) => {
  const nodes: any = [
    {
      host: client.config.LAVA_HOST,
      password: client.config.LAVA_PASSWORD,
      port: client.config.LAVA_PORT,
    },
  ];

  const clientID: string = client.config.SPOTIFY_CLIENT_ID;
  const clientSecret: string = client.config.SPOTIFY_SECRET_ID;
  const sendError = client.utils.sendError;

  client.manager = new Manager({
    nodes,
    plugins: [
      new Spotify({
        clientID,
        clientSecret,
      }),
      new Deezer({}),
      new Facebook(),
    ],
    autoPlay: true,
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id) as Guild;
      if (guild) guild.shard.send(payload);
    },
  });

  client.manager.init(client.user.id);
  client.manager.on("nodeConnect", (node) => {
    client.logger.success(`Node "${node.options.identifier}" connected.`);
  });

  //Node error event
  client.manager.on("nodeError", (node, error) => {
    client.logger.error(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    );
  });

  client.on("raw", (d) => client.manager.updateVoiceState(d));

  //Track start
  client.manager.on("trackStart", async (player, track) => {
    const channel = (await client.channels.fetch(
      player.textChannel
    )) as TextChannel;

    //Embed sent after the track starts playing.
    let np = new client.embed()
      .setMainColor()
      .setTitle("🎵 Now Playing:")
      // @ts-ignore
      .setDescription(
        `[${track.title}](${track.uri})\nRequested by: [ ${
          // @ts-ignore
          track.requester?.id ? track.requester : `<@${track.requester}>`
        } ]`
      )
      .setThumbnail(
        `https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`
      )
      .setFooter(
        `🎤 ${track.author}  •  ${
          track.isStream
            ? `◉ LIVE`
            : `🕒 ${client.utils.msConversion(track.duration)}`
        }`
      );

    let playingMessage;
    try {
      playingMessage = await channel.send(np);
      // @ts-ignore
      player.npMessage = playingMessage.id;
      await playingMessage.react("⏮");
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔇");
      await playingMessage.react("🔉");
      await playingMessage.react("🔊");
      await playingMessage.react("🔁");
      await playingMessage.react("🔀");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    let embed = new client.embed().setMainColor();

    const filter = (reaction, user) =>
      ["⏮", "⏭", "⏯", "🔇", "🔉", "🔊", "🔁", "🔀", "⏹"].includes(
        reaction.emoji.name
      );
    let collector = playingMessage.createReactionCollector(filter, {
      time: track.isStream ? 3 * 60 * 1000 : track.duration,
    });

    collector.on("collect", (reaction, user) => {
      if (user.bot) return;
      let guild = client.guilds.cache.get(player.guild) as Guild;
      let vchannel = guild.members.cache.get(user.id).voice
        .channel as VoiceChannel;

      switch (reaction.emoji.name) {
        case "⏮":
          if (!canModifyQueue(vchannel, player)) return;
          if (!player.playing) player.playing = true;
          if (!player.queue.previous) {
            reaction.users.remove(user).catch(console.error);
            embed.setColor("RED").setDescription(`There is no previous song!`);
            return channel.send(embed).catch(console.error);
          }
          player.queue.unshift(player.queue.previous);
          player.stop();
          embed.setDescription(
            `${user} ⏮ played the previous song [${player.queue.previous.title}](${player.queue.previous.uri})`
          );
          channel.send(embed).catch(console.error);
          collector.stop();
          break;
        case "⏭":
          if (!canModifyQueue(vchannel, player)) return;
          if (!player.playing) player.playing = true;
          if (player.queueRepeat || player.trackRepeat) {
            player.queue.push(player.queue.current);
          }
          player.stop();
          embed.setDescription(
            `${user} ⏭ skipped [${player.queue.current.title}](${player.queue.current.uri})`
          );
          channel.send(embed).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player)) return;
          if (!player.paused) {
            player.pause(true);
            embed.setDescription(`${user} ⏸ paused the music!`);
            channel.send(embed).catch(console.error);
          } else {
            player.pause(false);
            embed.setDescription(`${user} ▶ resumed the music!`);
            channel.send(embed).catch(console.error);
          }
          break;

        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player)) return;
          if (player.volume <= 0) {
            player.setVolume(100);
            embed.setDescription(`${user} 🔊 unmuted the music!`);
            channel.send(embed).catch(console.error);
          } else {
            player.setVolume(0);
            embed.setDescription(`${user} 🔇 muted the music!`);
            channel.send(embed).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player) || player.volume <= 0) return;
          if (player.volume - 10 <= 0) player.setVolume(0);
          else player.setVolume(player.volume - 10);
          embed.setDescription(
            `${user} 🔉 decreased the volume, the volume is now ${player.volume}%`
          );
          channel.send(embed).catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player) || player.volume >= 100) return;
          if (player.volume + 10 >= 100) player.setVolume(100);
          else player.setVolume(player.volume + 10);
          embed.setDescription(
            `${user} 🔊 increased the volume, the volume is now ${player.volume}%`
          );
          channel.send(embed).catch(console.error);
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player)) return;
          player.setQueueRepeat(!player.queueRepeat);
          embed.setDescription(
            `${user} 🔁 ${
              player.queueRepeat ? "**Enabled**" : "**Disabled**"
            } queue repeat`
          );
          channel.send(embed).catch(console.error);
          break;

        case "🔀":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player)) return;
          player.queue.shuffle();
          embed.setDescription(`${user} 🔀 shuffled the queue`);
          channel.send(embed).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(vchannel, player)) return;
          player.destroy();
          embed.setDescription(`${user} ⏹ stopped the music!`);
          channel.send(embed).catch(console.error);
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });
    collector.on("end", () => {
      setTimeout(() => {
        if (!playingMessage.deleted) {
          playingMessage.reactions.removeAll();
        }
      }, 500);
    });
  });

  // Emitted when the player track ends
  client.manager.on("trackEnd", async (player) => {
    const channel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;
    // @ts-ignore
    let npmsg: string = player.npMessage;
    let msg = await channel.messages.fetch(npmsg);
    if (msg) {
      msg.delete();
    }
  });

  // Emitted when the player queue ends
  client.manager.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;
    let embed = new client.embed()
      .setMainColor()
      .setDescription(":wave: Queue has ended. Bye!");
    player.destroy();
    channel.send(embed);
    // @ts-ignore
    let npmsg: string = player.npMessage;
    let msg = await channel.messages.fetch(npmsg);
    if (msg) {
      msg.delete();
    }
  });

  //Pauses music when the bot gets moved
  client.manager.on(
    "playerMove",
    async (player, currentChannel, newChannel) => {
      if (!newChannel) {
        player.destroy();
      } else {
        if (!player.paused) {
          player.voiceChannel = newChannel;
          player.pause(true);
          let embed = new client.embed()
            .setMainColor()
            .setTitle("⏸ The music is now paused")
            .setDescription(
              `Voice channel changed, use \`${client.prefix}resume\` to resume the music`
            );
          const channel = client.channels.cache.get(
            player.textChannel
          ) as TextChannel;
          return channel.send(embed);
        }
      }
    }
  );

  // Emitted when a track has an error during playback.
  client.manager.on("trackError", (player, track, error) => {
    const channel = client.channels.cache.get(
      player.textChannel
    ) as TextChannel;
    client.utils.sendError(
      `Error playing track [**${track.title}**]\n\`${JSON.stringify(error)}\``,
      channel
    );
  });

  function canModifyQueue(vchannel: VoiceChannel, player: any) {
    return !player || !vchannel || vchannel.id !== player.voiceChannel;
  }

  const manager = new SlashCommandManager(client);

  await manager.load("./src/slash");
  await manager.register();
  await manager.listen();

  client.logger.success(`${client.user.tag} is now online!`);

  const nf = Intl.NumberFormat();

  const activities = {
    get "0"() {
      return `${client.guilds.cache.size} servers!`;
    },
    get "1"() {
      return `discord.gg/vadebot | vade-bot.com`;
    },
    get "2"() {
      return `${nf.format(
        client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)
      )} users!`;
    },
  };

  client.guilds.cache.forEach(async (guild) => {
    if (guild.me.permissions.has("ADMINISTRATOR")) {
      let invites = await guild.fetchInvites();
      if (invites) client.invites.set(guild.id, invites);
    }
  });

  let i = 0;
  setInterval(
    () =>
      client.user.setActivity(`!help | ${activities[i++ % 3]}`, {
        type: "WATCHING",
      }),
    15000
  );
};

export const name: string = "ready";

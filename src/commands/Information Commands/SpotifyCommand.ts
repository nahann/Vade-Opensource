import type { RunFunction } from '../../interfaces/Command';;

   export const run: RunFunction = async(client, message, args) => {


    try {
       const member = await client.utils.getMember(message, args[0], true);
  
        const presence = member.presence.activities;
        if (!presence)
          return message.reply("that user isn't listening to Spotify!");
        const spotify =
          member.presence.activities.find(
            (spotify) => spotify.name === "Spotify"
          ) || presence.find((spotify) => spotify.type === "LISTENING");
        if (!spotify)
          return message.reply(
            `${member.user.username} isn\'t listening to Spotify!`
          );
        const trackIMG = spotify.assets.largeImageURL();
        const trackURL = `https://open.spotify.com/track/${spotify.syncID}`;
        const trackName = spotify.details;
        const trackAlbum = spotify.assets.largeText;
        const trackAuthor = spotify.state;
  
        const embed = new client.embed()
          .setAuthor(
            "Spotify Track Info",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
          )
          .setTitle(`${trackName}`)
          .setColor("#1DB954")
          .setThumbnail(trackIMG)
          .addField("Author", trackAuthor)
          .addField("Album", trackAlbum)
          .addField("Link", `[Listen along](${trackURL})`)
          .setFooter(`${member.user.username} is listening to ${trackName}.`);
  
        message.channel.send(embed);
      } catch (err) {
        message.channel.send(`Error occurred while fetching information: ${err}`);
      }


    }
export const name: string = 'spotify';
export const category: string = 'Information'
export const description: string = 'Get details on the current song that a user is listening to!';


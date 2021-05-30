import type { RunFunction } from '../../interfaces/Command';;
import { get } from 'imdb-api';

   export const run: RunFunction = async(client, message, args) => {

  
    if(!args.length) {
        return message.channel.send("Please give the name of movie or series")
      }
      
      
      let movie = await get({name: args.join(" ")},  { apiKey: "cdb2b2ae", timeout: 300000 });
      if(!movie) return client.utils.sendError(`Unable to locate that movie!`, message.channel);
      
      let embed = new client.embed()
      .setTitle(movie.title)
      .setClear()
      .setThumbnail(movie.poster)
      .setDescription(movie.plot)
      .setFooter(`Ratings: ${movie.rating}`)
      .addField("Country", movie.country, true)
      .addField("Languages", movie.languages, true)
      .addField("Type", movie.type, true);
      
      
      message.channel.send(embed)

    }
export const name: string = 'imdb';
export const category: string = 'Information';
export const description: string = 'Search up a movie title and view the results!';
export const aliases: string[] = ['movie'];
export const usage: string = '!imdb <Movie name>';

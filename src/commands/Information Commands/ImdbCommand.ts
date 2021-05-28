import { RunFunction } from '../../interfaces/Command';
import imdb from 'imdb-api';

   export const run: RunFunction = async(client, message, args) => {

  
    if(!args.length) {
        return message.channel.send("Please give the name of movie or series")
      }
      
      const imob = new imdb.Client({apiKey: "cdb2b2ae"}) //You need to paste you imdb api
      
      let movie = await imob.get({'name': args.join(" ")})
      
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

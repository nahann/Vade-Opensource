import { RunFunction } from '../../interfaces/Command';
import jimp from 'jimp'

   export const run: RunFunction = async(client, message, args) => {

    let img = jimp.read(
        "https://cdn.discordapp.com/attachments/747483679890341908/756156592449257602/trump.png"
      );
      if (!args[0])
        return client.utils.sendError("Please provide some text to assign.", message.channel);
      img.then((image) => {
        jimp.loadFont(jimp.FONT_SANS_32_BLACK).then((font) => {
          image.resize(1000, 500);
          image.print(font, 22, 120, args.join(" "), 600);
          image.getBuffer(jimp.MIME_PNG, (_err, i) => {
            message.channel.send({
              files: [{ attachment: i, name: "trump.png" }],
            });
          });
        });
      });


    }
export const name: string = 'trump';
export const category: string = 'Fun'
export const description: string = 'Receive an image of Donald Trump tweeting whatever you like.';
export const aliases: string[] = ['donaldtrump']

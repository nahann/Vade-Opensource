import phin from "phin";

import type { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
   const member = await client.utils.getMember(message, args[0], true);
   if (!member) {
       return;
   }

   const { body } = await phin<NekosLifeKiss>({
       url: "https://nekos.life/api/kiss",
       method: "get",
       headers: {
           Key: "dnZ4fFJbjtch56pNbfrZeSRfgWqdPDgf"
       },
       parse: "json"
   });

   const embed = new client.embed()
       .setDescription(`${member} You got a kiss from ${message.author.username} ❤`)
       .setImage(body.url);

   message.channel.send(embed);
}

export const name: string = 'kiss';
export const category: string = 'Fun';
export const description: string = 'Give someone a lovely kiss!';
export const aliases: string[] = ['smooch'];

export interface NekosLifeKiss {
    url: string;
}

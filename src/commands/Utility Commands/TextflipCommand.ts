import { RunFunction } from '../../interfaces/Command';
import dic from 'custom-translate';

let dictionary = {
    a: "ɐ",
    b: "q",
    c: "ɔ",
    d: "p",
    e: "ǝ",
    f: "ɟ",
    g: "ƃ",
    h: "ɥ",
    i: "ᴉ",
    j: "ɾ",
    k: "ʞ",
    m: "ɯ",
    n: "u",
    p: "d",
    q: "b",
    r: "ɹ",
    t: "ʇ",
    u: "n",
    v: "ʌ",
    w: "ʍ",
    y: "ʎ",
    A: "∀",
    C: "Ɔ",
    E: "Ǝ",
    F: "Ⅎ",
    G: "פ",
    J: "ſ",
    L: "˥",
    M: "W",
    P: "Ԁ",
    T: "┴",
    U: "∩",
    V: "Λ",
    W: "M",
    Y: "⅄",
    1: "Ɩ",
    2: "ᄅ",
    3: "Ɛ",
    4: "ㄣ",
    5: "ϛ",
    6: "9",
    7: "ㄥ",
    9: "6",
    ",": "'",
    ".": "˙",
    "'": ",",
    '"': ",,",
    _: "‾",
    "&": "⅋",
    "!": "¡",
    "?": "¿",
    "`": ",",
  };

   export const run: RunFunction = async(client, message, args) => {
    if(message.channel.type !== 'text') return;
    const text = args.join(" ");
    if(!text) return client.utils.sendError(`You need to specify some text to flip!`, message.channel);
    const converted = dic.letterTrans(text, dictionary);
    message.channel.send(converted);


    }
export const name: string = 'textflip';
export const category: string = 'Utility';
export const description: string = 'Flip some text upside down!';
export const aliases: string[] = ['fliptext'];

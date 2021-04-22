import { RunFunction } from "../../interfaces/Command";
import npmsearch from "libnpmsearch";
import moment from "moment-timezone";

export const run: RunFunction = async (client, message, args) => {
  if (!args.length) {
    return message.channel.send("Please give me package name!");
  }
  let toSearch: string = args.join(" ");
  npmsearch(toSearch, {
    limit: 1,
  }).then(async (result) => {
    if (!result || !result.length || !result.size) {
      return message.channel.send("Unable to locate that package!");
    }
    let res: object = result[0];
    let keywords: string[] = Object.keys(res).includes("keywords")
      ? (res["keywords"] as string[]).map((keyword) => `\`${keyword}\``)
      : ["No Data"];
    let maintainers: string[] = (res["maintainers"] as string[]).map(
      (maintainer) => `\`${maintainer["username"]}\``
    );
    let links: string[] = Object.keys(res["links"]).map(
      (key) => `**${key}：**${res["links"][key]}`
    );
    let publishDate: moment.Moment = moment(res["date"]).tz("CST");
    await message.channel.send(
      new client.embed()
        .setColor("#C80B06")
        .setTitle(res["name"])
        .setDescription(res["description"])
        .setThumbnail("https://i.imgur.com/ErKf5Y0.png")
        .addField("Version", `\`${res["version"]}\``, true)
        .addField(
          "Published date",
          `${publishDate.format("LL LTS")} \`${publishDate.fromNow()}\``
        )
        .addField("Keywords", keywords.join(", "), false)
        .addField("Author", `\`${res["author"]["name"]}\``, true)
        .addField("Maintainers", maintainers.join(", "), true)
        .addField("Links", links.join("\n"), false)
    );
  });
};

export const name: string = "npm";
export const usage: string = "!npm <To search for>";
export const category: string = "Development";

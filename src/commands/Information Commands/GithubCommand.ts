import type { RunFunction } from '../../interfaces/Command';;
import fetch from 'node-fetch';
import moment from 'moment';

   export const run: RunFunction = async(client, message, [repo]) => {

    if(!repo) return client.utils.sendError(`You need to provide a users repository.`, message.channel);

    const [username, repository] = repo.split("/");
	if(username && !repository) { //return m message.channel.send("Repository be in the form `username/repository`");
		fetch(`https://api.github.com/users/${username}`).then(res => res.json()).then((body) => {
			if(body.message) return message.channel.send("`🚫` No search results found, maybe try searching for something that exists.");
			const embed = new client.embed();
			embed.setTitle(`${body.login} (${body.id})`);
			embed.setAuthor("GitHub", "https://i.imgur.com/e4HunUm.png", "https://github.com/");
			embed.setURL(body.html_url);
			embed.setThumbnail(body.avatar_url);
			embed.setDescription(`${body.bio || "No Bio."}\n\n` + [`**❯ ID:** ${body.id}`, `**❯ Name:** ${body.login}`, `**❯ Location:** ${body.location || "No location"}`, `**❯ Repositories:** ${body.public_repos > 0 ? body.public_repos : "None"}`, `**❯ Followers:** ${body.followers > 0 ? body.followers : "None"}`, `**❯ Following:** ${body.following > 0 ? body.following : "None"}`, ].join("\n"));
			embed.addField("❯ Account Created", moment.utc(body.created_at).format("dddd, MMMM, Do YYYY (h:mm:ss)"));
			message.channel.send("", {
				embed: embed
			});
		});
		return;
	}
	const res = await fetch(`https://api.github.com/repos/${username}/${repository}`).catch(() => null);
	if(res.status === 404) return message.channel.send("`🚫` No search results found, maybe try searching for something that exists.");
	const body = await res.json();
	const size = body.size <= 1024 ? `${body.size} KB` : Math.floor(body.size / 1024) > 1024 ? `${(body.size / 1024 / 1024).toFixed(2)} GB` : `${(body.size / 1024).toFixed(2)} MB`;
	const license = body.license && body.license.name && body.license.url ? `[${body.license.name}](${body.license.url})` : body.license && body.license.name || "None";
	const embed = new client.embed();
	embed.setTitle(body.full_name);
	embed.setAuthor("GitHub", "https://i.imgur.com/e4HunUm.png", "https://github.com/");
	embed.setURL(body.html_url);
	embed.setThumbnail(body.owner.avatar_url);
	embed.setDescription(`${body.description || "No description."}\n\n` + [`**❯ Language:** ${body.language}`, `**❯ License:** ${license}`, `**❯ Size:** ${size}`, `**❯ Stars:** ${body.stargazers_count.toLocaleString() > 0 ? body.stargazers_count.toLocaleString() : "None"}`, `**❯ Forked:** ${body.forks_count.toLocaleString() > 0 ? body.forks_count.toLocaleString() : "None"}`, `**❯ Watchers:** ${body.subscribers_count.toLocaleString() > 0 ? body.subscribers_count.toLocaleString() : "None"}`, `**❯ Open Issues:** ${body.open_issues.toLocaleString() > 0 ? body.open_issues.toLocaleString() : "None"}`].join("\n"));
	if(body.fork) embed.addField("❯ Forked", `[${body.parent.full_name}](${body.parent.html_url})`, true);
	if(body.archived) embed.addField("❯ This repository is Archived", "\u200b", true);
	return message.channel.send("", {
		embed: embed
	});



    }
export const name: string = 'github';
export const category: string = 'Information';
export const description: string = 'Search up either a users GitBub accunt or a certain repository.';
export const aliases: string[] = ['gitsearch'];

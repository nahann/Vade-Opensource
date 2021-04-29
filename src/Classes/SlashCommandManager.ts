import { Bot } from "client/Client";
import { Client, Collection } from "discord.js";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { Interaction, SlashCommand, SlashCommandData, SlashCommandResponse } from "./types";

export default class SlashCommandManager {
    private commands?: Collection<string, SlashCommand>;

    constructor(private client: Bot) {}

    async load(path: string) {
        const directory = require.main?.path ? join(require.main.path, path) : path;

        const names = new Set<string>();

        const traverse = async (directory: string) => {
            const commands = await readdir(directory);

            const loaded: SlashCommand[] = [];

            for (const command of commands) {
                const filePath = join(directory, command);

                if ((await stat(filePath)).isDirectory()) {
                    loaded.push(...(await traverse(filePath)));
                    continue;
                }

                const file: SlashCommand = (await import(filePath)).default;

                if (!file.name) {
                    console.log(`The slash command in the file '${command}' has no name.`);
                    continue;
                }

                if (!file.execute) {
                    console.log(`The slash command in the file '${command}' has no callback.`);
                    continue;
                }

                if (names.has(file.name)) {
                    console.log(`Found duplicate slash command '${file.name}'.`);
                    continue;
                }

                loaded.push(file);

                console.log(`Loaded the '${file.name}' slash command!`);
            }

            return loaded;
        };

        const commands = await traverse(directory);

        this.commands = new Collection(commands.map((cmd) => [cmd.name, cmd]));

        return this.commands;
    }

    async register(commands?: SlashCommandData[]): Promise<SlashCommandResponse[]> {
        return commands
            ? commands!.map((data) =>
                  //@ts-ignore
                  this.client.api.applications(this.client.user!.id).commands.post({ data })
              )
            : this.commands!.map((data) =>
                  //@ts-ignore
                  this.client.api.applications(this.client.user!.id).commands.post({ data })
              );
    }

    async listen() {
        //@ts-ignore
        return this.client.ws.on("INTERACTION_CREATE", async (interaction: Interaction) => {
            if (!this.commands) return;

            if (!interaction.data) return;

            const { name } = interaction.data;

            const command = this.commands.get(name);

            if (!command) return;

            const { client } = this;

            command.execute(client, interaction, {
                async respond(content, options) {
                    //@ts-ignore
                    client.api.interactions(interaction.id, interaction.token).callback.post({
                        data: {
                            type: 4,
                            data: { ...content, ...options },
                        },
                    });

                    return content;
                },
            });
        });
    }
}
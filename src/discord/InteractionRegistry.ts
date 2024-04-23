import { InteractionType, REST, Routes, SlashCommandBuilder } from "discord.js";
import secrets from "../secrets";
import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { Help } from "./commands/documents/Help";
import { Remember } from "./commands/documents/Remember";
import { Search } from "./commands/documents/Search";

export class InteractionRegistry {
  private commands: Command[] = [
    new Ping(),
    new Remember(),
    new Search(),
    new Help(),
  ];

  private discord = new REST({ version: "9" }).setToken(secrets.discord.token);

  find(name: string): Command | undefined {
    return this.commands.find(
      (command) => command.name.toLowerCase() === name.toLowerCase()
    );
  }

  list(options: Partial<{ types: InteractionType[] }> = {}): Command[] {
    let commands = this.commands;

    if (options.types) {
      commands = commands.filter((command) =>
        command.interactionTypes.some((type) => options.types?.includes(type))
      );
    }

    return this.commands.sort((a, b) => a.name.localeCompare(b.name));
  }

  public async register() {
    const commands = this.commands.map((command) => {
      return command.options(
        new SlashCommandBuilder()
          .setName(command.name)
          .setDescription(command.description)
      ) as SlashCommandBuilder;
    });

    const createdCommands = (await this.discord.put(
      Routes.applicationCommands(secrets.discord.clientID),
      {
        body: commands.map((c) => c.toJSON()),
      }
    )) as { id: string; name: string }[];

    for (const createdCommand of createdCommands) {
      const command = this.find(createdCommand.name);

      if (command) {
        command.discordID = createdCommand.id;
      }
    }
  }
}

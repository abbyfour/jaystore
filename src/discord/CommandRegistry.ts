import { Client, Constants } from "eris";
import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { Remember } from "./commands/documents/Remember";
import { Search } from "./commands/documents/Search";

export class CommandRegistry {
  commands: Command[] = [new Ping(), new Remember(), new Search()];

  find(alias: string): Command | undefined {
    return this.commands.find((command) =>
      command.aliases.includes(alias.toLowerCase())
    );
  }

  public async registerToClient(client: Client) {
    for (const command of this.commands) {
      await client.createCommand({
        name: command.aliases[0],
        description: command.description,
        options: command.options,
        type: Constants.ApplicationCommandTypes.CHAT_INPUT,
      });
    }
  }
}

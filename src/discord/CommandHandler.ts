import { CommandInteraction, Interaction } from "eris";
import { Bot } from "./Bot";
import { CommandRegistry } from "./CommandRegistry";

export class CommandHandler {
  private registry = new CommandRegistry();

  public async initialize() {
    await this.registry.registerToClient(Bot.getInstance().client);
  }

  public async handle(interaction: Interaction) {
    if (interaction instanceof CommandInteraction) {
      const command = this.registry.find(interaction.data.name);

      if (command) {
        await command.run(interaction);
      }
    }
  }
}

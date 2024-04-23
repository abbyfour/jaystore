import { Interaction } from "discord.js";
import { InteractionRegistry } from "./InteractionRegistry";

export class InteractionHandler {
  public readonly registry = new InteractionRegistry();

  public async initialize() {
    await this.registry.register();
  }

  public async handle(interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = this.registry.find(interaction.commandName);

      if (command) {
        await command.run(interaction);
      }
    }
  }
}

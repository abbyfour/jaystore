import { CommandInteraction, InteractionType } from "discord.js";
import { Command } from "../Command";

export class Ping extends Command {
  public interactionTypes: InteractionType[] = [
    InteractionType.ApplicationCommand,
  ];

  public name = "ping";
  public description = "Check if JayStore is online!";

  async run(interaction: CommandInteraction): Promise<void> {
    await this.reply(interaction, "Pong!");
  }
}

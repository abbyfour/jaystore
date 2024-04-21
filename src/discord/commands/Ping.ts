import { CommandInteraction } from "eris";
import { Command } from "../Command";

export class Ping extends Command {
  public aliases = ["ping", "pong"];
  public description = "Check if JayStore is online!";

  async run(interaction: CommandInteraction): Promise<void> {
    await this.reply(interaction, "Pong!");
  }
}

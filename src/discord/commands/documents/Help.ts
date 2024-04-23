import { CommandInteraction, InteractionType } from "discord.js";
import { Command } from "../../Command";
import { displayClickableCommand } from "../../framework/display";

export class Help extends Command {
  public name: string = "help";
  public description: string = "Shows a list of available commands";
  public interactionTypes = [InteractionType.ApplicationCommand];

  async run(interaction: CommandInteraction): Promise<void> {
    const embed = this.embed().setTitle("Help").setDescription(`
      Here is a list of available commands:
${this.bot.interactions
  .list({ types: [InteractionType.ApplicationCommand] })
  .map((c) => displayClickableCommand(c) + ` - _${c.description}_`)
  .join("\n")}
      `);

    await this.reply(interaction, embed);
  }
}

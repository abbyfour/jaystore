import {
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { Link } from "../../../entities/Link";
import { Command } from "../../Command";

export class Remember extends Command {
  public name: string = "remember";
  public description: string = "Saves a link for reference";
  public interactionTypes = [InteractionType.ApplicationCommand];

  public options = (slashCommand: SlashCommandBuilder) =>
    slashCommand
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription("The link to save")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("The title of the link")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("author")
          .setDescription("The author of the linked document (eg. TransLink)")
          .setRequired(true)
      );

  async run(interaction: CommandInteraction): Promise<void> {
    const url = this.getOption<string>(interaction, "url");
    const title = this.getOption<string>(interaction, "title");
    const author = this.getOption<string>(interaction, "author");

    const link = Link.create({
      url,
      title,
      author,
    });

    await link.save();

    const embed = this.embed().setTitle("Link saved!").setDescription(`
    ### Link saved!
      ${link.author}: [${link.title}](${link.url})`);

    await this.reply(interaction, embed);
  }
}

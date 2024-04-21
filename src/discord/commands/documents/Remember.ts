import {
  ApplicationCommandOptions,
  CommandInteraction,
  Constants,
  TextableChannel,
} from "eris";
import { Link } from "../../../entities/Link";
import { Command } from "../../Command";

export class Remember extends Command {
  public aliases: string[] = ["remember", "save"];
  public description: string = "Saves a link for reference";
  public options: ApplicationCommandOptions[] = [
    {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      name: "url",
      description: "The link to save",
      required: true,
    },
    {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      name: "title",
      description: "The title of the link",
      required: true,
    },
    {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      name: "author",
      description: "The author of the linked document (eg. TransLink)",
      required: true,
    },
  ];

  async run(interaction: CommandInteraction<TextableChannel>): Promise<void> {
    const url = this.getOption<string>(interaction, "url");
    const title = this.getOption<string>(interaction, "title");
    const author = this.getOption<string>(interaction, "author");

    const link = Link.create({
      url,
      title,
      author,
    });

    await link.save();

    await this.replyEmbed(interaction, {
      description: `### Link saved!
      ${link.author}: [${link.title}](${link.url})`,
    });
  }
}

import {
  ApplicationCommandOptions,
  CommandInteraction,
  Constants,
  TextableChannel,
} from "eris";
import { escape } from "sqlstring";
import { ILike, Raw } from "typeorm";
import { Link } from "../../../entities/Link";
import { Command } from "../../Command";

export class Search extends Command {
  public aliases: string[] = ["search", "find"];
  public description: string = "Searches remembered links";
  public options: ApplicationCommandOptions[] = [
    {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      name: "keywords",
      description: "Search the title of the link",
    },
    {
      type: Constants.ApplicationCommandOptionTypes.STRING,
      name: "author",
      description: "The author of the link",
    },
  ];

  async run(interaction: CommandInteraction<TextableChannel>): Promise<void> {
    const keywords = this.getOption<string>(interaction, "keywords");
    const author = this.getOption<string>(interaction, "author");

    if (!keywords && !author) {
      await this.replyEmbed(interaction, {
        description: "Please provide either keywords or an author to search",
      });
      return;
    }

    let linksQuery = Link.createQueryBuilder()
      .orderBy(`SIMILARITY(title, ${escape(keywords)})`, "DESC")
      .limit(10);

    if (keywords) {
      linksQuery = linksQuery
        .where({
          title: Raw(
            (alias) => `:keywords % ANY(STRING_TO_ARRAY(${alias},' '))`,
            {
              keywords,
            }
          ),
        })
        .orWhere({
          title: ILike(`%${keywords}%`),
        });
    }

    if (author) {
      linksQuery = linksQuery.andWhere({
        author: ILike(`%${author}%`),
      });
    }

    const links = await linksQuery.getMany();

    await this.replyEmbed(interaction, {
      description: `Links found matching ${
        keywords ? `keywords=${keywords} ` : ""
      }${author ? `author=${author} ` : ""}
      
${links
  .map((link) => `**${link.author}**: [${link.title}](${link.url})`)
  .join(`\n`)}`,
    });
  }
}

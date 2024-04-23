import {
  CommandInteraction,
  InteractionType,
  SlashCommandBuilder,
} from "discord.js";
import { escape } from "sqlstring";
import { ILike, Raw } from "typeorm";
import { Link } from "../../../entities/Link";
import { Command } from "../../Command";

export class Search extends Command {
  public name: string = "search";
  public description: string = "Searches remembered links";
  public interactionTypes = [InteractionType.ApplicationCommand];
  public options = (slashCommand: SlashCommandBuilder) =>
    slashCommand
      .addStringOption((option) =>
        option
          .setName("keywords")
          .setDescription("Search the title of the link")
      )
      .addStringOption((option) =>
        option.setName("author").setDescription("The author of the link")
      );

  async run(interaction: CommandInteraction): Promise<void> {
    const keywords = this.getOption<string>(interaction, "keywords");
    const author = this.getOption<string>(interaction, "author");

    if (!keywords && !author) {
      await this.reply(
        interaction,
        this.errorEmbed().setDescription(
          "Please provide either keywords or an author to search"
        )
      );

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

    await this.reply(
      interaction,
      this.embed().setDescription(`Links found matching ${
        keywords ? `keywords=${keywords} ` : ""
      }${author ? `author=${author} ` : ""}
      
${links
  .map((link) => `**${link.author}**: [${link.title}](${link.url})`)
  .join(`\n`)}`)
    );
  }
}

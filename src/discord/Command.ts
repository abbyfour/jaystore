import { ApplicationCommandOptions, CommandInteraction } from "eris";
import { Bot } from "./Bot";

export abstract class Command {
  public aliases: string[] = [];
  public description = "";
  public options: ApplicationCommandOptions[] = [];

  protected get bot(): Bot {
    return Bot.getInstance();
  }

  abstract run(interaction: CommandInteraction): Promise<void>;

  protected async reply(interaction: CommandInteraction, content: string) {
    await interaction.createMessage(content);
  }

  protected async replyEmbed(interaction: CommandInteraction, content: object) {
    await interaction.createMessage({ embeds: [content] });
  }

  protected getURL(string: string): string | undefined {
    const urlRegex =
      /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/;
    const url = string.match(urlRegex);
    return url ? url[0] : undefined;
  }

  protected getOption<T>(
    interaction: CommandInteraction,
    name: string
  ): T | undefined {
    return (
      interaction.data.options?.find((option) => option.name === name) as any
    )?.value as T;
  }
}

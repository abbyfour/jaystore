import {
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  InteractionType,
  Message,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Bot } from "./Bot";
import theme from "./framework/theme";

type ReplyOptions = {
  content: string | EmbedBuilder;
  file?: AttachmentBuilder;
  ping?: boolean;
};

export type SlashCommandData =
  | RESTPostAPIChatInputApplicationCommandsJSONBody
  | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
  | SlashCommandSubcommandsOnlyBuilder;

export abstract class Command {
  private _discordID: string = "";
  public abstract name: string;
  public description = "";
  public options: (slashCommand: SlashCommandBuilder) => SlashCommandData = (
    s
  ) => s;
  public abstract interactionTypes: InteractionType[];

  public get discordID() {
    return this._discordID;
  }

  public set discordID(discordID: string) {
    if (this._discordID) {
      throw new Error("Cannot set discordID more than once");
    }

    this._discordID = discordID;
  }

  protected get bot(): Bot {
    return Bot.getInstance();
  }

  abstract run(interaction: CommandInteraction): Promise<void>;

  protected async reply(
    interaction: CommandInteraction,
    replyOptions: ReplyOptions
  ): Promise<InteractionResponse>;
  protected async reply(
    interaction: CommandInteraction,
    content: EmbedBuilder
  ): Promise<Message>;
  protected async reply(
    interaction: CommandInteraction,
    content: string
  ): Promise<Message>;
  protected async reply(
    interaction: CommandInteraction,
    content: any
  ): Promise<InteractionResponse | Message> {
    if (content instanceof EmbedBuilder) {
      return await interaction.reply({ embeds: [content] });
    } else if (typeof content === "string") {
      return await interaction.reply({ content });
    } else {
      content.content instanceof EmbedBuilder
        ? { embeds: [content.content] }
        : { content: content.content };

      return await interaction.reply({
        ...content,
        files: content.file ? [content.file] : undefined,
        allowedMentions: content.ping ? { repliedUser: true } : { parse: [] },
      });
    }
  }

  public getOption<T>(interaction: CommandInteraction, name: string): T {
    return interaction.options.get(name)?.value as T;
  }

  protected getURL(string: string): string | undefined {
    const urlRegex =
      /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/;
    const url = string.match(urlRegex);
    return url ? url[0] : undefined;
  }

  protected embed(): EmbedBuilder {
    return new EmbedBuilder().setColor(theme.primary);
  }

  protected errorEmbed(): EmbedBuilder {
    return new EmbedBuilder().setColor(theme.error);
  }
}

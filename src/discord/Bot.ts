import { Client, IntentsBitField } from "discord.js";
import secrets from "../secrets";
import { InteractionHandler } from "./InteractionHandler";

export class Bot {
  private static instance: Bot;

  public client: Client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.DirectMessages,
      IntentsBitField.Flags.DirectMessageReactions,
    ],
  });
  private interactionHandler = new InteractionHandler();

  public get interactions() {
    return this.interactionHandler.registry;
  }

  private constructor() {}

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  async login() {
    await this.client.login(secrets.discord.token);

    this.client.on("ready", async () => {
      await this.interactionHandler.initialize();

      console.log("Commands initiliazed.");

      this.listenForCommands();
    });
  }

  private listenForCommands() {
    this.client.on("interactionCreate", (interaction) => {
      this.interactionHandler.handle(interaction);
    });
  }
}

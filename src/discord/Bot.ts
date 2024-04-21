import Eris, { Client, Constants } from "eris";
import secrets from "../secrets";
import { CommandHandler } from "./CommandHandler";

export class Bot {
  private static instance: Bot;

  public client: Client = Eris(`Bot ${secrets.token}`, {
    intents: [
      Constants.Intents.guilds,
      Constants.Intents.guildMessages,
      Constants.Intents.guildMessageReactions,
      Constants.Intents.directMessages,
      Constants.Intents.directMessageReactions,
    ],
  });
  private commandHandler = new CommandHandler();

  private constructor() {}

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  async login() {
    await this.client.connect();

    this.client.on("ready", async () => {
      await this.commandHandler.initialize();

      console.log("Commands initiliazed.");

      this.listenForCommands();
    });
  }

  private listenForCommands() {
    this.client.on("interactionCreate", (interaction) => {
      this.commandHandler.handle(interaction);
    });
  }
}

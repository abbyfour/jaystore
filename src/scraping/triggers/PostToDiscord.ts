import { ScrapingResultTrigger } from "./ScrapingResultTrigger";

export class PostToDiscord<T> extends ScrapingResultTrigger<T> {
  public async execute(entity: T): Promise<void> {
    console.log(`Posting ${JSON.stringify(entity, null, 2)} to Discord...`);
  }
}

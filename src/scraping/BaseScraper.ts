import axios from "axios";
import { CheerioAPI, load } from "cheerio";
import path from "path";
import { ScrapingSchedule } from "./ScrapingSchedule";
import { ScrapingResultTrigger } from "./triggers/ScrapingResultTrigger";

export abstract class BaseScraper<T> {
  public abstract readonly url: string;
  public abstract readonly path: string;
  public abstract readonly schedule: ScrapingSchedule;
  public abstract readonly triggers: ScrapingResultTrigger<T>[];

  public abstract scrapeAndExtract(): Promise<void>;

  protected async getHTML(path: string = ""): Promise<CheerioAPI> {
    const response = await this.fetch(path);

    return load(response);
  }

  protected async fetch(extraPath: string): Promise<string> {
    const response = await axios.get(
      path.join(this.url, this.path, extraPath),
      {
        responseType: "text",
        validateStatus: null,
      }
    );

    return response.data as string;
  }
}

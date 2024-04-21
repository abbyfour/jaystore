import { parse } from "date-fns";
import path from "path";
import { BaseScraper } from "../BaseScraper";
import { ScrapingSchedule } from "../ScrapingSchedule";
import { PostToDiscord } from "../triggers/PostToDiscord";
import { ScrapingResultTrigger } from "../triggers/ScrapingResultTrigger";

export interface Bid {
  url: string;
  opportunityId: string;
  description: string;
  endsAt: Date;
  commodities: string[];
  issuedBy: string;
}

export class BCBidScraper extends BaseScraper<Bid> {
  public readonly url = "https://www.bcbid.gov.bc.ca/";
  public readonly path = "page.aspx/en/rfp/request_browse_public";

  public readonly schedule = new ScrapingSchedule({
    interval: "daily",
    atTime: "00:00",
  });

  public triggers: ScrapingResultTrigger<Bid>[] = [
    new PostToDiscord(
      (bid) => bid.issuedBy === "Ministry of Transportation and Infrastructure"
    ),
    new PostToDiscord((bid) => bid.issuedBy.startsWith("TransLink")),
  ];

  public async scrapeAndExtract(): Promise<void> {
    const $ = await this.getHTML();

    const bidList = [] as Bid[];

    $(`[data-object-type="rfp"]`).each((_, rfp) => {
      const tds = $(rfp).find("td").toArray();

      const opportunityIdLink = $(tds[1]).find("a");

      const url = opportunityIdLink.attr("href") ?? "";
      const opportunityId = opportunityIdLink.text().trim();
      const description = $(tds[2]).text().trim();
      const endsIn = parse(
        $(tds[6]).text().trim(),
        "y-MM-dd hh:mm:ss aaaa",
        new Date()
      );
      const issuedBy = $(tds[10]).text().trim();

      bidList.push({
        url: path.join(this.url, url),
        opportunityId,
        description,
        issuedBy,
        endsAt: endsIn,
        commodities: [],
      });
    });

    this.triggerTriggers(bidList);
  }

  private async triggerTriggers(bids: Bid[]): Promise<void> {
    for (const trigger of this.triggers) {
      for (const bid of bids) {
        if (trigger.when(bid)) {
          await trigger.execute(bid);
        }
      }
    }
  }
}

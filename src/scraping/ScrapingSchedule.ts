interface ScrapingScheduleOptions {
  interval: "daily" | "weekly" | "monthly" | "yearly";
  atTime?: `${number}:${number}`;
}

export class ScrapingSchedule {
  constructor(public options: ScrapingScheduleOptions) {}
}

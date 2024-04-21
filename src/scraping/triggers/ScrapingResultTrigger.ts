export abstract class ScrapingResultTrigger<T> {
  constructor(public readonly when: (entity: T) => boolean) {}

  public abstract execute(entity: T): Promise<void>;
}

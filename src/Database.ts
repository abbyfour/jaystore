import { DataSource } from "typeorm";
import { Link } from "./entities/Link";
import secrets from "./secrets";

export class Database {
  private static instance: Database;
  private datasource: DataSource;

  private constructor() {
    this.datasource = new DataSource({
      type: "postgres",
      host: secrets.database.host,
      port: secrets.database.port,
      username: secrets.database.username,
      password: secrets.database.password,
      database: secrets.database.name,
      synchronize: true,
      logging: false,
      entities: [Link],
    });
  }

  public async connect() {
    await this.datasource.initialize();
    await this.datasource.synchronize();
    this.datasource.setOptions({ logging: true });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getDataSource() {
    return this.datasource;
  }
}

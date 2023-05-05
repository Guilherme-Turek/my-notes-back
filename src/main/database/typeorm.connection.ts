import { DataSource } from "typeorm";
import config from "../config/typeorm.config";

export class TypeormConnection {
  private static _connection: DataSource;

  public static async connect() {
    this._connection = await config.initialize();
    console.log("Typeorm is ready.");
  }

  public static get connection() {
    if (!this._connection) {
      throw new Error("db not connected");
    }
    return this._connection;
  }
}

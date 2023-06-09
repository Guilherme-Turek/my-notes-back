import { serverEnv } from "../../app/envs/server.envs";
import { createApp } from "../config/express.config";
import { RedisConnection } from "../database/redis.connections";
import { TypeormConnection } from "../database/typeorm.connection";
import { Express } from "express";

export class Server {
  private static app: Express;

  public static run() {
    Server.app = createApp();

    Promise.all([TypeormConnection.connect(), RedisConnection.connect()]).then(
      this.listen
    );
  }

  private static listen() {
    Server.app.listen(serverEnv.port, () => console.log("Server is running."));
  }
}

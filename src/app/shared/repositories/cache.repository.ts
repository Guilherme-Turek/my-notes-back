import { Redis } from "ioredis";
import { RedisConnection } from "../../../main/database/redis.connections";

export class CacheRepository {
  private repository: Redis = RedisConnection.connection;

  public async get<T>(key: string) {
    const result = await this.repository.get(key);

    if (!result) {
      return null;
    }

    return JSON.parse(result) as T;
  }

  public async set(key: string, value: any) {
    await this.repository.set(key, JSON.stringify(value));
  }
}

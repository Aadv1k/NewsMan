import { Cache } from "./cache";
import { News } from "../types";

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

import fs from "fs/promises";

export default class LocalCache implements Cache {
  private cacheFilePath: string;

  constructor(config?: any) {
    this.cacheFilePath = config?.cacheFilePath || "./cache.json";
  }

  async store(data: Array<News>): Promise<void> {
    const toStore = JSON.stringify({
      cachedAt: Date.now(),
      data,
    });
    await fs.writeFile(this.cacheFilePath, toStore, "utf-8");
  }

  async isFresh(): Promise<boolean> {
    try {
      const stats = await fs.stat(this.cacheFilePath);
      const currentTime = Date.now();
      const cacheAge = currentTime - stats.mtimeMs;
      const maxCacheAge = TWENTY_FOUR_HOURS_IN_MS;

      return cacheAge <= maxCacheAge;
    } catch (error: any) {
      return false;
    }
  }

  async fetch(): Promise<Array<News>> {
    try {
      const cacheData = await fs.readFile(this.cacheFilePath, "utf-8");
      const parsedData = JSON.parse(cacheData);

      if (parsedData.cachedAt && (Date.now() - parsedData.cachedAt) <= TWENTY_FOUR_HOURS_IN_MS) {
        return parsedData.data || [];
      }
    } catch (error: any) {
      return [];
    }

    return [];
  }
}

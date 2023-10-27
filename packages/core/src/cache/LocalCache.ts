import { Cache, NewsArticle } from "./";

import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";

const ONE_HOUR_IN_MS = 3600000;


export default class LocalCache implements Cache {
    private dirpath: string;
    private timeToExpireInMS: number;

    constructor(timeToExpireInMS: number) {
        this.dirpath = path.join(".NewsMan_Core_LocalCache");
        this.timeToExpireInMS = timeToExpireInMS ?? ONE_HOUR_IN_MS;
        fs.mkdir(this.dirpath, { recursive: true })
            .catch((error) => {
                console.error("Error creating cache directory:", error);
            });
    }

    async store(key: string, news: Array<NewsArticle>) {
        assert(!/\s/.test(key), "Can't have spaces in the key");
        const time = Date.now();
        const filepath = path.join(this.dirpath, `${key}.json`);

        await fs.writeFile(filepath, JSON.stringify({
            cachedAt: time,
            data: news,
        }));
    }

    async fetch(key: string): Promise<Array<NewsArticle> | null> {
        const filepath = path.join(this.dirpath, `${key}.json`);
        try {
            const data = await fs.readFile(filepath, "utf8");
            const cacheEntry = JSON.parse(data);
            return cacheEntry.data;
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return null;
            } else {
                throw err;
            }
        }
    }

    async isFresh(key: string, timeInMS?: number): Promise<boolean> {
        timeInMS = timeInMS ?? this.timeToExpireInMS;
        const filepath = path.join(this.dirpath, `${key}.json`);
        try {
            const data = await fs.readFile(filepath, "utf8");
            const cacheEntry = JSON.parse(data);
            const cacheTime = cacheEntry.cachedAt;
            const currentTime = Date.now();
            return currentTime - cacheTime < timeInMS;
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }
}

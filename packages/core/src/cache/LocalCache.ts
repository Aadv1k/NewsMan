import { Cache, NewsArticle } from "./";

import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";

export default class LocalCache implements Cache {
    private dirpath: string;

    constructor() {
        this.dirpath = path.join(__dirname, ".NewsMan_Core_LocalCache");
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

    async isFresh(key: string): Promise<boolean> {
        const filepath = path.join(this.dirpath, `${key}.json`);
        try {
            const data = await fs.readFile(filepath, "utf8");
            const cacheEntry = JSON.parse(data);
            const cacheTime = cacheEntry.cachedAt;
            const currentTime = Date.now();
            return currentTime - cacheTime < 60 * 60 * 1000;
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }
}

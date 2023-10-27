import fetchDataForSource from "./NewsProvider";

import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert";

import { Cache } from "./cache"

import { NewsArticle } from "./NewsProvider";

import * as utils from "./utils"

const HEADLINES_PATH = path.join(__dirname, "../dql/headlines");

interface NewsFilters {
  excludeDomains: Array<string>;
  countryCode: string;
}

export async function fetchHeadlines(filters: NewsFilters, cache?: Cache) {
    const dirpath = HEADLINES_PATH;

    const fileNames = await fs.readdir(dirpath);

    assert(
      fileNames.length !== 0,
      `At least one DracoQL file is expected in ${dirpath}`
    );

    let newsArticles: NewsArticle[] = [];

    for (const fname of fileNames) {
      const parsedFileName = utils.parseDqlFileName(fname);
      if (!parsedFileName) continue;

      const { domain, language, country } = parsedFileName;

      if (
        filters.excludeDomains.some((e: string) => domain.includes(e)) ||
        filters.countryCode !== country
      ) {
        continue;
      }

      let articles: NewsArticle[];

      if (cache) {
        const cacheKey = `cache_${domain}_${language}_${country}`;
        const cachedArticles = await cache.fetch(cacheKey);
        if (cachedArticles && await cache.isFresh(cacheKey)) {
          articles = cachedArticles;
        } else {
          articles = await fetchDataForSource(domain, dirpath);
          await cache.store(cacheKey, articles);
        }
      } else {
        articles = await fetchDataForSource(domain, dirpath);
      }

      newsArticles = [...articles, ...newsArticles];
    }
    return newsArticles;
}

import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert';

import fetchDataForSource, { NewsArticle } from './NewsProvider';
import { Cache } from './cache';
import * as utils from './utils';

const HEADLINES_PATH = path.join(__dirname, '../dql/headlines');

interface NewsFilters {
  excludeDomains?: string[];
  countryCode?: string;
}

import { default as SourceProvider, NewsSrc } from "./SourceProvider";

export async function fetchHeadlines(filters: NewsFilters, cache?: Cache) {
  await SourceProvider.registerFromDir(HEADLINES_PATH);

  assert(
    SourceProvider.sources.size !== 0,
    `At least one DracoQL file is expected in ${HEADLINES_PATH}`
  );

  let newsArticles: NewsArticle[] = [];

  const fetchPromises = Array.from(SourceProvider.sources).map(async ([, source]) => {
    const { domain, languageCode, countryCode } = source;

    if (
      (filters.excludeDomains ?? []).some((e) => domain.includes(e)) ||
      (filters.countryCode && filters.countryCode !== countryCode)
    ) {
      return;
    }

    let articles: NewsArticle[] = [];

    if (cache) {
      const cacheKey = `cache_${domain}_${languageCode}_${countryCode}`;
      const cachedArticles = await cache.fetch(cacheKey);
      if (cachedArticles && (await cache.isFresh(cacheKey))) {
        articles = cachedArticles;
      } else {
        articles = await fetchDataForSource(source);
        await cache.store(cacheKey, articles);
      }
    } else {
      articles = await fetchDataForSource(source);
    }

    newsArticles.push(...articles);
  });

  await Promise.all(fetchPromises);

  return newsArticles;
}

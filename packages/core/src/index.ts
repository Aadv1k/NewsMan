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

interface NewsSrc {
  domain: string;
  countryCode: string;
  languageCode: string;
  sourceCode: string;
}

class NewsSource {
  sources: Map<string, NewsSrc>;

  constructor() {
    this.sources = new Map();
  }

  async registerFromFile(filepath: string) {
    const fname = path.basename(filepath);
    const parsedFileName = utils.parseDqlFileName(fname);
    if (!parsedFileName) throw new Error('Unable to parse the name, incorrect format');

    const content = await fs.readFile(filepath, 'utf-8');

    if (!content.trim()) throw new Error('Empty file content');

    this.sources.set(parsedFileName.domain, {
      domain: parsedFileName.domain,
      countryCode: parsedFileName.countryCode,
      sourceCode: content,
      languageCode: '',
    });
  }

  async registerFromDir(dirpath: string) {
    const fnames = await fs.readdir(dirpath);
    for (const fname of fnames) {
      const filePath = path.join(dirpath, fname);

      await this.registerFromFile(filePath);
    }
  }

  async register(source: NewsSrc) {
    this.sources.set(source.domain, {
      domain: source.domain,
      countryCode: source.countryCode,
      sourceCode: source.sourceCode,
      languageCode: '',
    });
  }
}

const SourceProvider = new NewsSource();

export async function fetchHeadlines(filters: NewsFilters, cache?: Cache) {
  await SourceProvider.registerFromDir(HEADLINES_PATH);

  assert(
    SourceProvider.sources.size !== 0,
    `At least one DracoQL file is expected in ${HEADLINES_PATH}`
  );

  let newsArticles: NewsArticle[] = [];

  SourceProvider.sources.forEach((source: NewsSrc) => {
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

  return newsArticles;
}

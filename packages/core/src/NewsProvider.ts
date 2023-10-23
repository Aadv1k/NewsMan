import * as fs from "fs/promises";
import * as path from "path";
import assert from "assert";

import he from "he";

import * as dracoAdapter from "./DracoAdapter";
import * as utils from "./utils";

import ArticleInfoExtractor from "./ArticleInfoExtractor";

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  description: string | null;
  publishedAt: Date | null;
  urlToImage: string | null;
}

interface ProviderConfig {
  countryCode?: string;
  domains?: string[];
  excludeDomains?: string[];
}

function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default class NewsProvider {
  private headlineDirPath?: string;
  private everythingDirPath?: string;
  private defaultCountryCode: string;

  constructor(
    headlineDir?: string,
    everythingDir?: string,
    defaultCountryCode?: string
  ) {
    this.headlineDirPath = headlineDir;
    this.everythingDirPath = everythingDir;
    this.defaultCountryCode = defaultCountryCode ?? "in";
  }

  async fetchHeadlinesForSource(source: string): Promise<NewsArticle[]> {
    if (!this.headlineDirPath) {
      throw new Error(
        "ERROR: fetchHeadlines cannot be used without specifying headlineDirPath"
      );
    }
    return this.fetchDataForSource(source, this.headlineDirPath as string);
  }

  async fetchEverythingForSource(source: string): Promise<NewsArticle[]> {
    if (!this.everythingDirPath) {
      throw new Error(
        "ERROR: fetchEverything cannot be used without specifying everythingDirPath"
      );
    }
    return this.fetchDataForSource(source, this.everythingDirPath as string);
  }

  async fetchAllHeadlines(config: ProviderConfig): Promise<NewsArticle[]> {
    if (!this.headlineDirPath) {
      throw new Error(
        "ERROR: fetchHeadlines cannot be used without specifying headlineDirPath"
      );
    }
    return this.fetchAndParseDQLFromDir(this.headlineDirPath, config);
  }

  private async fetchDataForSource(
    source: string,
    dirpath: string
  ): Promise<Array<NewsArticle>> {
    const newsArticles: Array<NewsArticle> = [];

    const sources = await fs.readdir(dirpath);
    const foundSource = sources.find((e: string) => e.startsWith(source));

    if (!foundSource) return [];
    const dracoQLFileContent = await fs.readFile(
      path.join(dirpath, foundSource),
      "utf-8"
    );
    let extractedDQLVars = await dracoAdapter.runQueryAndGetVars(
      dracoQLFileContent
    );

    const dqlHtmlObjects = Object.values(extractedDQLVars as any).filter(
      (dqlVar: any) => dqlVar.type !== "HTML"
    ) as Array<dracoAdapter.DQLObject>;

    for (const dqlHtmlObj of dqlHtmlObjects) {
      for (const childElement of dqlHtmlObj.value.children) {
        if ((childElement as any).type === "TextNode") {
          continue;
        }

        const reg = /(h[0-6]|^span|^b|^em|^i)/;
        if (childElement.tag.match(reg)) continue;

        const flatObject =
          dracoAdapter.serializeDQLHtmlElementToObject(childElement);

        let urlToImage = flatObject.images?.[0]?.src || null;
        if (urlToImage) {
          if (!utils.isRelativeURL(urlToImage)) {
            urlToImage = urlToImage.replace(/\/\//, "https://");
          }
          urlToImage = utils.sanitizeUrl(urlToImage);
        }

        let url = flatObject.links[0]?.href;

        if (!url) continue;

        if (utils.isRelativeURL(url)) {
          url = `https://${source}/${url as string}`;
        }
        url = utils.sanitizeUrl(url);

        let title = he.decode(
          flatObject.headings?.[0] ||
            flatObject.links[0]?.text ||
            flatObject.images[0]?.alt ||
            ""
        );

        const article: NewsArticle = {
          title,
          url,
          urlToImage,
          source,
          description: null,
          publishedAt: null,
        };

        const extractor = new ArticleInfoExtractor(article.url);
        await extractor.setup();

        article.description = extractor.getDescription();
        article.publishedAt = utils.convertToDate(
          extractor.getPublishedAt() || ""
        );
        article.title = extractor.getTitle() as string;

        if (!article.description && !article.publishedAt) {
          await extractor.setHeadless();

          article.description = extractor.getDescription();
          article.publishedAt = utils.convertToDate(
            extractor.getPublishedAt() || ""
          );
          article.title = extractor.getTitle() as string;

          if (!article.description && !article.publishedAt) continue;
        }

        article.description = he.decode(article.description);

        // NOTE(aadv1k): we can't reliably get the author due to the homogeneity of text-based data
        // article.author = extractor.getAuthor();

        newsArticles.push(article);
      }
    }
    return newsArticles;
  }

  private async fetchAndParseDQLFromDir(
    dirpath: string,
    config: ProviderConfig = {}
  ): Promise<NewsArticle[]> {
    const {
      countryCode = this.defaultCountryCode,
      domains = [],
      excludeDomains = [],
    } = config;

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
        excludeDomains.some((e: string) => domain.includes(e)) ||
        countryCode !== country
      ) {
        continue;
      }

      const articles = await this.fetchDataForSource(domain, dirpath);
      newsArticles = [...articles, ...newsArticles];
    }
    return newsArticles;
  }
}

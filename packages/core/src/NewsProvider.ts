import * as fs from "fs/promises";
import * as path from "path";
import assert from "assert";

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

export default async function fetchDataForSource(source: NewsSrc): Promise<Array<NewsArticle>> {
    const newsArticles: Array<NewsArticle> = [];

    let extractedDQLVars = await dracoAdapter.runQueryAndGetVars(
        source.sourceCode
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

            let title = flatObject.headings?.[0] ||
                flatObject.links[0]?.text ||
                flatObject.images[0]?.alt || ""

            let article: NewsArticle = {
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
                const [description, publishedAt, title] = await extractor.runTasksWithHeadless(
                    [
                        () => extractor.getDescription(), () => extractor.getPublishedAt(), () => extractor.getTitle()]
                );
                if (!description || !title) continue;

                article = {
                    ...article,
                    description,
                    title,
                    publishedAt: utils.convertToDate(publishedAt || ""),
                }

            }
            // NOTE(aadv1k): we can't reliably get the author due to the homogeneity of text-based data
            // article.author = extractor.getAuthor();

            newsArticles.push(article);
        }
    }
    return newsArticles;
}

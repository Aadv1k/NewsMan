import assert from 'assert';
import fs from 'fs/promises';
import * as path from 'path';

import * as draco from 'dracoql';
import * as dracoAdapter from './DracoAdapter';
import * as utils from './utils';

import { parse as nodeHtmlParser } from 'node-html-parser';

function sanitizeUrl(url: string): string {
    const urlParts = url.split('?');
    if (urlParts.length > 1) {
        return urlParts[0];
    }
    return url;
}

class ArticleInfoExtractor {
    private url: string;
    private query: string;
    private htmlContentRoot: any;

    constructor(url: string) {
        this.url = url;
        this.query = `VAR data = FETCH "${url}" CACHE 6e10 "./" AS HTML HEADLESS`;
        this.htmlContentRoot = null;
    }

    async setup() {
        const data = await dracoAdapter.runQueryAndGetVars(this.query);
        this.htmlContentRoot = nodeHtmlParser(data?.data?.value || "");
    }

    getTitle(): string | null {
        if (!this.htmlContentRoot) {
            return null;
        }
        const h1Element = this.htmlContentRoot.querySelector("h1");
        return h1Element ? h1Element.innerText.trim() : null;
    }

getDescription(): string | null {
    if (!this.htmlContentRoot) {
        return null;
    }
    const descriptionElement = this.htmlContentRoot.querySelectorAll("p").find((e: any) => {
        const innerText = e.innerText.trim().toLowerCase().replace(/[\n\r]/g, '').trim();
        return innerText.length > 200;
    });

    if (descriptionElement) {
        const sanitizedDescription = descriptionElement.innerText
            .trim()
            .toLowerCase()
            .replace(/[\n\r]/g, '')
            .trim();

        return sanitizedDescription;
    }

    return null;
}

    getPublishedAt(): string | null {
        if (!this.htmlContentRoot) {
            return null;
        }
        const dateElement = this.htmlContentRoot.querySelectorAll("p, span").find((e: any) => e.innerText.toLowerCase().includes("updated"));
        if (dateElement) {
            const dateString = dateElement.innerText.trim().replace(/updated\:/i, "");
            return dateString;
        }
        return null;
    }
}

function convertToDate(dateString: string): Date | null {
    const dateRegex = /(\w+) (\d{2}), (\d{4}) (\d{1,2}):(\d{2}) (am|pm) (\w+)/i;
    const match = dateString.match(dateRegex);

    if (!match) {
        return null;
    }

    const [, month, day, year, hours, minutes, ampm, timeZone] = match;
    const isPM = ampm.toLowerCase() === 'pm';

    const months: { [key: string]: number } = {
        january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
        july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
    };

    const monthIndex = months[month.toLowerCase()];
    if (monthIndex === undefined) {
        return null;
    }

    let hours24 = parseInt(hours, 10);
    if (isPM && hours24 !== 12) {
        hours24 += 12;
    } else if (!isPM && hours24 === 12) {
        hours24 = 0;
    }

    const date = new Date();
    date.setFullYear(parseInt(year, 10));
    date.setMonth(monthIndex);
    date.setDate(parseInt(day, 10));
    date.setHours(hours24);
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

export interface News {
    title: string;
    url: string;
    source: string;
    description: string | null;
    publishedAt: string | null;
    urlToImage: string | null;
}

interface DQLTextNode {
    type: 'TextNode';
    text: string;
}

interface ProviderConfig {
    countryCode?: string;
    excludeDomains?: string[];
    maxItems?: number;
    domains?: string[];
}

export default class NewsProvider {
    private headlineDirPath?: string;
    private everythingDirPath?: string;
    private defaultCountryCode: string;

    constructor(headlineDir?: string, everythingDir?: string, defaultCountryCode?: string) {
        this.headlineDirPath = headlineDir;
        this.everythingDirPath = everythingDir;
        this.defaultCountryCode = defaultCountryCode ?? 'in';
    }

    async fetchHeadlines(config: ProviderConfig = {}): Promise<News[]> {
        if (!this.headlineDirPath) throw new Error('ERROR: fetchHeadlines cannot be used without specifying headlineDirPath');
        return this.fetchAndParseDQLFromDir(this.headlineDirPath, config);
    }

    async fetchEverything(config: ProviderConfig = {}): Promise<News[]> {
        if (!this.everythingDirPath) throw new Error('ERROR: fetchEverything cannot be used without specifying everythingDirPath');
        return this.fetchAndParseDQLFromDir(this.everythingDirPath, config);
    }

    private async fetchAndParseDQLFromDir(dirpath: string, config: ProviderConfig = {}): Promise<News[]> {
        const { countryCode = this.defaultCountryCode, maxItems = 10, excludeDomains = [], domains = [] } = config;
        const files = await fs.readdir(dirpath);
        assert(files.length !== 0, `At least one DracoQL file is expected in ${dirpath}`);

        const newsArticles: News[] = [];

        for (const file of files) {
            let { domain: fileDomain, region: fileCountryCode } = utils.parseDQLFileName(file);

            if (newsArticles.length >= maxItems) break;
            if (excludeDomains.some((e: string) => fileDomain.includes(e)) || countryCode.toLowerCase() !== fileCountryCode) continue;

            try {
                const dracoQLFileContent = await fs.readFile(path.join(dirpath, file), 'utf-8');
                const extractedDQLVars = await dracoAdapter.runQueryAndGetVars(dracoQLFileContent);
                const dqlHtmlObjects = Object.values(extractedDQLVars as any)
                    .filter((dqlVar: any) => dqlVar.type !== 'HTML') as Array<dracoAdapter.DQLObject>;

                for (const childElement of dqlHtmlObjects[0].value.children.slice(0, 3)) {
                    if ((childElement as any).type === 'TextNode') continue;

                    const flatObject = dracoAdapter.serializeDQLHtmlElementToObject(childElement);

                    let article = {
                        title: flatObject.headings?.[0] || flatObject.links[0]?.text || flatObject.images[0]?.alt || '',
                        url: utils.isRelativeURL(flatObject.links[0]?.href || '') ? `${fileDomain}/${flatObject.links[0]?.href || ''}` : flatObject.links[0]?.href || '',
                        urlToImage: sanitizeUrl(flatObject.images?.[0]?.src || "") || '',
                        source: fileDomain,
                        description: null,
                        publishedAt: null
                    } as News;

                    const extractor = new ArticleInfoExtractor(article.url);

                    await extractor.setup();

                    article.description = extractor.getDescription();
                    article.publishedAt = extractor.getPublishedAt();

                    newsArticles.push(article);
                }
            } catch (error: any) {
                throw new Error(`ERROR: failed to parse DracoQL due to error: ${error.message}`);
            }
        }
        return newsArticles;
    }
}

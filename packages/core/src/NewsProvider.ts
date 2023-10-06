import * as fs from 'fs/promises';
import * as path from 'path';
import assert from 'assert';

import * as dracoAdapter from './DracoAdapter';
import * as utils from './utils';

import ArticleInfoExtractor from './ArticleInfoExtractor';

export interface NewsSource {
    id: string;
    country: string;
}

export interface NewsArticle {
    title: string;
    url: string;
    source: string;
    author: string | null;
    description: string | null;
    publishedAt: Date | null;
    urlToImage: string | null;
}

interface DQLTextNode {
    type: 'TextNode';
    text: string;
}

interface ProviderConfig {
    countryCode?: string;
    domains?: string[];
    excludeDomains?: string[];
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

    async fetchHeadlinesForSource(source: NewsSource): Promise<NewsArticle[]> {
        if (!this.headlineDirPath) {
            throw new Error('ERROR: fetchHeadlines cannot be used without specifying headlineDirPath');
        }
        return this.fetchDataForSource(source, this.headlineDirPath as string);
    }

    async fetchEverythingForSource(source: NewsSource): Promise<NewsArticle[]> {
        if (!this.everythingDirPath) {
            throw new Error('ERROR: fetchEverything cannot be used without specifying everythingDirPath');
        }
        return this.fetchDataForSource(source, this.everythingDirPath as string);
    }

    async fetchAllHeadlines(config: ProviderConfig): Promise<NewsArticle[]> {
        if (!this.headlineDirPath) {
            throw new Error('ERROR: fetchHeadlines cannot be used without specifying headlineDirPath');
        }
        return this.fetchAndParseDQLFromDir(this.headlineDirPath, config);
    }

    async getSources(): Promise<Array<NewsSource>> {
        const sources = [];
        const files = await fs.readdir(this.headlineDirPath as string);
        for (const filepath of files) {
            const [name, ext] = filepath.split('.');
            const [id, country] = name.split('_');
            sources.push({
                id: id.replace(/-/, '.'),
                country: country,
            });
        }
        return sources;
    }

    private async fetchDataForSource(source: NewsSource, dirpath: string): Promise<Array<NewsArticle>> {
        const newsArticles = [];
        const dqlPath = `${source.id.replace(/./, '-')}_${source.country}.dql`;
        const fileDomain = `https://${source.id.replace(/./, '-')}`;

        try {
            const dracoQLFileContent = await fs.readFile(path.join(dirpath, dqlPath), 'utf-8');
            const extractedDQLVars = await dracoAdapter.runQueryAndGetVars(dracoQLFileContent);
            const dqlHtmlObjects = Object.values(extractedDQLVars as any)
                .filter((dqlVar: any) => dqlVar.type !== 'HTML') as Array<dracoAdapter.DQLObject>;

            for (const childElement of dqlHtmlObjects[0].value.children) {
                if ((childElement as any).type === 'TextNode') {
                    continue;
                }

                const flatObject = dracoAdapter.serializeDQLHtmlElementToObject(childElement);

                const article: NewsArticle = {
                    title: flatObject.headings?.[0] || flatObject.links[0]?.text || flatObject.images[0]?.alt || '',
                    url: utils.isRelativeURL(flatObject.links[0]?.href || '') ? `${fileDomain}/${flatObject.links[0]?.href || ''}` : flatObject.links[0]?.href || '',
                    urlToImage: utils.sanitizeUrl(flatObject.images?.[0]?.src || '') || null,
                    source: fileDomain,
                    description: null,
                    publishedAt: null,
                    author: null,
                };

                const extractor = new ArticleInfoExtractor(article.url);
                await extractor.setup();

                article.description = extractor.getDescription();
                article.publishedAt = utils.convertToDate(extractor.getPublishedAt() as string);
                article.author = extractor.getAuthor();
                newsArticles.push(article);
            }
        } catch (error: any) {
            throw new Error(`ERROR: failed to parse DracoQL due to error: ${error.message}`);
        }
        return newsArticles;


        try {
            const dracoQLFileContent = await fs.readFile(path.join(dirpath, dqlPath), 'utf-8');
            const extractedDQLVars = await dracoAdapter.runQueryAndGetVars(dracoQLFileContent);
            const dqlHtmlObjects = Object.values(extractedDQLVars as any)
                .filter((dqlVar: any) => dqlVar.type !== 'HTML') as Array<dracoAdapter.DQLObject>;

            for (const childElement of dqlHtmlObjects[0].value.children) {
                if ((childElement as any).type === 'TextNode') {
                    continue;
                }

                const flatObject = dracoAdapter.serializeDQLHtmlElementToObject(childElement);

                const article: NewsArticle = {
                    title: flatObject.headings?.[0] || flatObject.links[0]?.text || flatObject.images[0]?.alt || '',
                    url: utils.isRelativeURL(flatObject.links[0]?.href || '') ? `${fileDomain}/${flatObject.links[0]?.href || ''}` : flatObject.links[0]?.href || '',
                    urlToImage: utils.sanitizeUrl(flatObject.images?.[0]?.src || '') || null,
                    source: fileDomain,
                    description: null,
                    publishedAt: null,
                    author: null,
                };

                const extractor = new ArticleInfoExtractor(article.url);
                await extractor.setup();

                article.description = extractor.getDescription();
                article.publishedAt = utils.convertToDate(extractor.getPublishedAt() as string);
                article.author = extractor.getAuthor();
                newsArticles.push(article);
            }
        } catch (error: any) {
            throw new Error(`ERROR: failed to parse DracoQL due to error: ${error.message}`);
        }
        return newsArticles;
    }

    private async fetchAndParseDQLFromDir(dirpath: string, config: ProviderConfig = {}): Promise<NewsArticle[]> {
        const { countryCode = this.defaultCountryCode, domains = [], excludeDomains = [] } = config;
        const files = await fs.readdir(dirpath);
        assert(files.length !== 0, `At least one DracoQL file is expected in ${dirpath}`);

        let newsArticles: NewsArticle[] = [];

        for (const filepath of files) {
            const [ domain, region ] = (filepath.split(".").shift() as any).split("_");

            if (excludeDomains.some((e: string) => domain.includes(e)) || countryCode.toLowerCase() !== region) {
                continue;
            }

            const articles = await this.fetchDataForSource({ id: domain, country: region }, dirpath);
            newsArticles = [...articles, ...newsArticles];
        }
        return newsArticles;
    }
}

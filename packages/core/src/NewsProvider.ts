import assert from 'assert';
import fs from 'fs/promises';
import * as path from 'path';

import * as draco from 'dracoql';
import * as dracoAdapter from './DracoAdapter';
import * as utils from './utils';

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

  private getNewsFromFlatObject(flatObject: dracoAdapter.DQLFlatObject, fileDomain: string): News {
    return {
      title: flatObject.headings?.[0] || flatObject.links[0]?.text || flatObject.images[0]?.alt || '',
      url: utils.isRelativeURL(flatObject.links[0]?.href || '') ? `${fileDomain}/${flatObject.links[0]?.href || ''}` : flatObject.links[0]?.href || '',
      description: flatObject.paragraphs?.[0] || '',
      source: fileDomain,
      publishedAt: null, // TODO: this attribute is not attached to many card-like-ui which is common for news articles
      urlToImage: flatObject.images?.[0]?.src || '',
    };
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
        const [dqlHtmlObject] = await dracoAdapter.runQueryAndGetVars(
            await fs.readFile(path.join(dirpath, file)
                            , 'utf-8'));

        for (const childElement of dqlHtmlObject.value.children) {
            if ((childElement as any).type === 'TextNode') continue;
          const flatObject = dracoAdapter.serializeDQLHtmlElementToObject(childElement);
          newsArticles.push(this.getNewsFromFlatObject(flatObject, fileDomain));
        }
      } catch (error: any) {
        throw new Error(`ERROR: failed to parse DracoQL due to error: ${error.message}`);
      }
    }
    return newsArticles;
  }
}

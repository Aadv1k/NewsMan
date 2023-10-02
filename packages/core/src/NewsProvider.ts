import * as draco from 'dracoql';
import assert from 'assert';
import { promises as fs } from 'fs';
import * as path from 'path';
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

interface DQLHtmlElement {
  tag: string;
  attributes: {
    href?: string;
    src?: string;
    alt?: string;
  };
  children: Array<DQLHtmlElement>;
}

interface DQLObject {
  type: 'JSON' | 'HTML';
  value: DQLHtmlElement;
}

interface ProviderConfig {
  countryCode?: string;
  excludeDomains?: string[];
  maxItems?: number;
  domains?: string[];
}

interface DQLFlatObject {
  headings: string[];
  links: {
    href: string;
    text: string;
  }[];
  paragraphs: string[];
  images: {
    src: string;
    alt: string;
  }[];
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

  private serializeDQLObjectToObject(element: DQLHtmlElement): DQLFlatObject {
    const flatObject: DQLFlatObject = {
      headings: [],
      links: [],
      paragraphs: [],
      images: [],
    };

    function processElement(node: DQLHtmlElement) {
      if (!node.tag) return;

      switch (node.tag) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          flatObject.headings.push((node.children[0] as any)?.text || ''); // Why is TypeScript so insufferable?
          break;
        case 'a':
          if ((node.children[0] as any)?.type === 'TextNode') {
            flatObject.links.push({ href: node.attributes.href || '', text: (node.children[0] as any).text });
          } else if (node.children[0]?.tag === 'img') {
            flatObject.images.push({ src: node.children[0].attributes.src || '', alt: node.children[0].attributes.alt || '' });
          }
          break;
        case 'img':
          flatObject.images.push({ src: node.attributes.src || '', alt: node.attributes.alt || '' });
          break;
        case 'p':
          flatObject.paragraphs.push((node.children[0] as any)?.text || '');
          break;
        case 'article':
        case 'div':
        case 'li':
          break;
        default:
          throw new Error(`ERROR unhandled tag: ${node.tag}`);
      }

      if (node.children) {
        for (const child of node.children) {
          processElement(child);
        }
      }
    }

    processElement(element);
    return flatObject;
  }

  private getNewsFromFlatObject(flatObject: DQLFlatObject, fileDomain: string): News {
    return {
      title: flatObject.headings?.[0] || flatObject.links[0]?.text || flatObject.images[0]?.alt || '',
      url: utils.isRelativeURL(flatObject.links[0]?.href || '') ? `${fileDomain}/${flatObject.links[0]?.href || ''}` : flatObject.links[0]?.href || '',
      description: flatObject.paragraphs?.[0] || '',
      source: fileDomain,
      publishedAt: null, // TODO: this attribute is not attached to many card-like-ui which is common for news articles
      urlToImage: flatObject.images?.[0]?.src || '',
    };
  }

  private async readAndParseDQL(filepath: string): Promise<DQLObject[]> {
    const fileContent = await fs.readFile(filepath, 'utf-8');

    let dracoLexer, dracoParser, dracoInterpreter;

    try {
      dracoLexer = new draco.lexer(fileContent);
      dracoParser = new draco.parser(dracoLexer.lex());
      dracoInterpreter = new draco.interpreter(dracoParser.parse());
    } catch (error: any) {
      throw new Error(`ERROR: unable to parse DracoQL due to error: ${error.message}`);
    }

    try {
      await dracoInterpreter.run();
    } catch (error: any) {
      throw new Error(`ERROR: unable to fetch headlines due to DracoQL error: ${error.message}`);
    }

    return Object.values(dracoInterpreter.NS as any).filter((dqlVar: any) => dqlVar.type !== 'HTML') as Array<DQLObject>;
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
        const dqlHtmlObjects = await this.readAndParseDQL(path.join(dirpath, file));
        dqlHtmlObjects[0].value.children.forEach((elem: DQLHtmlElement) => {
          if ((elem as any)?.type === 'TextNode') return;

          const flatObject = this.serializeDQLObjectToObject(elem);
          newsArticles.push(this.getNewsFromFlatObject(flatObject, fileDomain));
        });
      } catch (error: any) {
        throw new Error(`ERROR: failed to parse DracoQL due to error: ${error.message}`);
      }
    }
    return newsArticles;
  }
}

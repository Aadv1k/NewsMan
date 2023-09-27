import * as draco from 'dracoql';
import assert from 'assert';
import path from 'path';
import { promises as fs } from 'fs';

import * as utils from './utils';

const HEADLINE_SOURCE_PATH = "../dql/headlines/"
const MAX_DEFAULT_HEADLINES = 10;


import { News } from "./types";

interface DQLTextNode {
  type: 'TextNode';
  text: string;
}

interface DQLHtmlElement {
  tag: string;
  attributes: {
    href?: string;
    src?: string;
  };
  children: Array<DQLHtmlElement | DQLTextNode>;
}

interface DQLHtmlObject {
  type: 'JSON';
  value: DQLHtmlElement;
}

interface ProviderConfig {
  maxItems?: number;
  countryCode?: string;
  excludeDomains?: Array<string>;
}

interface DQLFlatObject {
  headings: Array<string>;
  links: Array<{
    href: string;
    text: string;
  }>;
  paragraphs: Array<string>;
  images: Array<{
    src: string;
    alt: string;
  }>;
}


export class NewsProvider {
    private serializeDQLObjectToObject(element: DQLHtmlElement): DQLFlatObject {
        const flatObject: DQLFlatObject = {
            headings: [],
            links: [],
            paragraphs: [],
            images: [],
        };

        function processElement(node: any) {
            if (!node.tag) return;

            switch (node.tag) {
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                    flatObject.headings.push((node.children[0] as DQLTextNode)?.text || '');
                    break;
                case "a":
                    if (node.children[0]?.type === 'TextNode') {
                        flatObject.links.push({ href: node.attributes.href, text: node.children[0].text });
                    } else if (node.children[0]?.tag === 'img') {
                        flatObject.images.push({ src: node.children[0].attributes.src, alt: node.children[0].attributes.alt });
                    }
                    break;
                case "p":
                    flatObject.paragraphs.push((node.children[0] as DQLTextNode)?.text || '');
                case "article":
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


    async fetchHeadlines(config: ProviderConfig = {}): Promise<News[]> {
        const { countryCode = "in", maxItems = 10, excludeDomains = [] } = config;

        const dirPath = path.join(__dirname, HEADLINE_SOURCE_PATH);
        const files = await fs.readdir(dirPath);
        assert.notStrictEqual(files.length, 0, `At least one DracoQL file is expected in ${HEADLINE_SOURCE_PATH}`);

        const newsArticles: News[] = [];

        for (const file of files) {
            const {
                domain: fileDomain,
                region: fileCountryCode,
            } = utils.parseDQLFileName(file);


            if (excludeDomains.includes(fileDomain) || countryCode !== fileCountryCode) {
                continue;
            }

            if (newsArticles.length >= maxItems) {
                break;
            }

            const filePath = path.join(dirPath, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');

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

            const dracoNS = dracoInterpreter.NS;

            for (let key in dracoNS) {
                if (dracoNS[key]?.type === 'HTML' || !dracoNS?.[key]) {
                    continue;
                }

                (dracoNS[key] as any).value.children.forEach((elem: any) => {
                    if (elem?.type === 'TextNode') {
                        return;
                    }

                    const news = this.serializeDQLObjectToObject(elem);
                    const newsArticle: News = {
                        title: news.headings?.[0] || news.links[0]?.text || news.images[0]?.alt,
                        url: utils.isRelativeURL(news.links[0].href) ? `${fileDomain}/${news.links[0].href}` : news.links[0].href,
                        description: news.paragraphs?.[0] || null,
                        source: fileDomain,
                        publishedAt: null, // TODO: find some way to implement this
                        urlToImage: news.images?.[0]?.src || null,
                    }

                    newsArticles.push(newsArticle);
                });
            }
        }
        return newsArticles;
    }
}

export default NewsProvider;


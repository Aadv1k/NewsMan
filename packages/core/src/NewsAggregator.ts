import * as draco from "dracoql";
import assert from 'assert';

import * as utils from "./utils";

import path from "path";
import fs from "fs/promises";

export interface News {
    title: string;
    description?: string | null;
    coverUrl?: string;
    url: string;
}

export interface ProviderConfig {
    maxItems?: number;
    excludeSites?: Array<string>;
}

const HEADLINE_SOURCE_PATH = "../dql/headlines";
const DQL_EXTENSION = ".dql";

interface DQLTextNode {
    type: "TextNode";
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

function serializeDQLObjectToObject(element: DQLHtmlElement): DQLFlatObject {
  const containerTagSet = new Set(["div", "article", "span", "li", "ul", "ol"]);
  if (!containerTagSet.has(element.tag))
    throw new Error(`ERROR: serializeDQLObjectToObject expected a container tag, got ${element.tag}`);

  const flatObject: DQLFlatObject = {
    headings: [],
    links: [],
    paragraphs: [],
    images: [],
  };

  function processElement(node: any) {
    if (node.tag === "h1" || node.tag === "h2" || node.tag === "h3" || node.tag === "h4" || node.tag === "h5" || node.tag === "h6") {
      flatObject.headings.push((node.children[0] as DQLTextNode)?.text || "");
    } else if (node.tag === "a" && node.attributes?.href) {
      if (node.children[0]?.type === "TextNode") {
        flatObject.links.push({ href: node.attributes.href, text: node.children[0].text });
      } else if (node.children[0]?.tag === "img") {
          flatObject.images.push({ src: node.children[0].attributes.src, alt: node.children[0].attributes.alt });
      }


    } else if (node.tag === "p") {
      flatObject.paragraphs.push((node.children[0] as DQLTextNode)?.text || "");
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

export default class NewsProvider {
    async fetchHeadlines(config: ProviderConfig): Promise<News[]> {
        const dirPath = path.join(__dirname, HEADLINE_SOURCE_PATH);
        const files = await fs.readdir(dirPath);
        assert.notStrictEqual(files.length, 0, `At least one DracoQL file is expected in ${HEADLINE_SOURCE_PATH}`);
        let newsArticles: News[] = [];

        for (const fileName of files) {
            if (!fileName.endsWith(DQL_EXTENSION)) continue;
            const filePath = path.join(dirPath, fileName);
            const fileContent = await fs.readFile(filePath, "utf-8");

            let dracoLexer, dracoParser, dracoInterpreter;

            try {
                dracoLexer = new draco.lexer(fileContent);
                dracoParser = new draco.parser(dracoLexer.lex());
                dracoInterpreter = new draco.interpreter(dracoParser.parse());
            } catch (error: any) {
                throw new Error("ERROR: unable to parse DracoQL due to error: " + error.message);
            }

            try {
                await dracoInterpreter.run();
            } catch (error: any) {
                throw new Error("ERROR: unable to fetch headlines due to DracoQL error: " + error.message);
            }

            const dracoNS = dracoInterpreter.NS;

            for (let key in dracoNS) {
                if (dracoNS[key]?.type === "HTML" || !dracoNS?.[key]) continue;

                (dracoNS[key] as any).value.children.forEach((elem: any) => {
                    if (elem?.type === "TextNode") return;
                    const news = serializeDQLObjectToObject(elem)

                    newsArticles.push({
                        title: news.headings?.[0] || news.links[0].text || news.images[0].alt,
                        url: utils.isRelativeURL(news.links[0].href) ?
                            `${utils.convertKebabCaseToURL(fileName)}/${news.links[0].href}` : news.links[0].href,
                        description: news.paragraphs?.[0] || null,
                        coverUrl: news.images?.[0].src,
                    }); 
                })
            }
        }
        return newsArticles;
    }
}

import * as draco from "dracoql";
import assert from 'node:assert';

import path from "node:path";
import fs from "node:fs";

export interface News {
  title: string;
  description?: string;
  coverUrl?: string;
  url: string;
}

export interface ProviderConfig {
    maxItems?: number;
    excludeSites?: Array<string>;
}

const HEADLINE_SOURCE_PATH = "./dql/headlines";
const DQL_EXTENSION = ".dql";

interface DQLObject {
  type: 'JSON';
  value: {
    tag: string;
    attributes: {
      href?: string;
      src?: string;
    };
    children: {
      type: 'TextNode';
      text?: string;
    }[];
  };
}

export default class NewsProvider {
    private extractNewsFromDQLObject(obj: DQLObject): Array<News> {
        const newsList: Array<News> = [];

        function traverseChildren(element: any) {
            if (element.tag === 'a' && element.attributes?.href) {
                const news: News = {
                    title: '',
                    description: '',
                    url: element.attributes.href,
                    coverUrl: '',
                };

                for (const child of element.children) {
                    if (child.type === 'TextNode' && child.text) {
                        if (!news.title) {
                            news.title = child.text;
                        } else {
                            if (news.description) {
                                news.description += ' ';
                            }
                            news.description += child.text;
                        }
                    }
                }

               newsList.push(news);
            }

            if (element.children) {
                for (const child of element.children) {
                    traverseChildren(child);
                }
            }
        }

        traverseChildren(obj.value);

        return newsList;
    }

    async fetchHeadlines(config: ProviderConfig): Promise<News[]> {
        const files = fs.readdirSync(HEADLINE_SOURCE_PATH);
        assert.equal(files.length, 0, `At least one DracoQL file is expected in ${HEADLINE_SOURCE_PATH}`);
        let newsArticles: News[] = [];

        for (const fileName of files) {
            if (!fileName.endsWith(DQL_EXTENSION)) continue;
            const fileContent = fs.readFileSync(path.join(__dirname, HEADLINE_SOURCE_PATH, fileName), "utf-8");
            const dracoNamespace: any  = await new Promise((resolve, reject) => {
                draco.eval(fileContent, (ctx) => resolve(ctx.getVar("data")));
            });
            for (const dracoObject of dracoNamespace) {
                if (dracoObject.type === "HTML") continue;
                newsArticles.push(...this.extractNewsFromDQLObject(dracoObject));
            }
        }

        return newsArticles;
    }
}

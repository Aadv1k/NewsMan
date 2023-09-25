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

const HEADLINE_SOURCE_PATH = "../dql/headlines";
const DQL_EXTENSION = ".dql";

interface DQLObject {
    type: 'JSON';
    value: {
        tag: string;
        attributes: {
            href?: string;
            src?: string;
        };
        children: Array<{
            type: 'JSON';
            value: {
                tag: string;
                attributes: {
                    href?: string;
                    src?: string;
                };
                children: Array<{
                    type: 'TextNode';
                    text?: string;
                }>;
            };
        }>;
    };
}

export default class NewsProvider {
    private extractNewsFromDQLObject(value: DQLObject["value"]): Array<News> {
        const newsArticles: News[] = [];
        let currentGroup: News | null = null;

        if (!value.children) return [];
        for (const elem of value.children) {
            const innerValue: any = elem.value;
            switch (innerValue.tag) {
                case "div":
                case "section":
                case "main":
                case "span":
                    if (currentGroup) {
                        newsArticles.push(currentGroup);
                        currentGroup = null;
                    }
                    newsArticles.push(...this.extractNewsFromDQLObject(innerValue));
                    break;
                case "h1":
                case "h2":
                case "h3":
                case "h4":
                case "h5":
                case "h6":
                    if (!currentGroup) {
                        currentGroup = { title: "", description: "", coverUrl: "", url: "" };
                    }
                    currentGroup.title = innerValue.children[0].text || "";
                    break;
                case "p":
                    const firstChild = innerValue.children[0];
                    if (firstChild.type === "TextNode") {
                        if (!currentGroup) {
                            currentGroup = { title: "", description: "", coverUrl: "", url: "" };
                        }
                        currentGroup.description = firstChild.text || "";
                    } else if (innerValue.tag === "a" && firstChild.text) {
                        if (!currentGroup) {
                            currentGroup = { title: "", description: "", coverUrl: "", url: "" };
                        }
                        currentGroup.coverUrl = innerValue.attributes?.href || "";
                    }
                    break;
                case "img":
                    if (currentGroup) {
                        currentGroup.coverUrl = innerValue.attributes?.src || "";
                    }
                    break;
                default:
                    assert(false, "Unidentified tag");
            }
        }

        if (currentGroup) {
            newsArticles.push(currentGroup);
        }
        return newsArticles;
    }

    async fetchHeadlines(config: ProviderConfig): Promise<News[]> {
        const files = fs.readdirSync(path.join(__dirname, HEADLINE_SOURCE_PATH));
        assert.notEqual(files.length, 0, `At least one DracoQL file is expected in ${HEADLINE_SOURCE_PATH}`);
        let newsArticles: News[] = [];

        for (const fileName of files) {
            if (!fileName.endsWith(DQL_EXTENSION)) continue;
            const fileContent = fs.readFileSync(path.join(__dirname, HEADLINE_SOURCE_PATH, fileName), "utf-8");

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
                const news = this.extractNewsFromDQLObject(dracoNS[key] as any);
                newsArticles.push(...news);
            }
        }
        return newsArticles;
    }
}

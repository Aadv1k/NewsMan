import { NewsArticle } from "../NewsProvider";
export { NewsArticle } from "../NewsProvider";

export interface Cache {
    store: (key: string, news: Array<NewsArticle>) => Promise<void>;
    fetch: (key: string) => Promise<Array<NewsArticle> | null>;
    isFresh: (key: string) => Promise<boolean>;
}

export { default as LocalCache } from "./LocalCache";

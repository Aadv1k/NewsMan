import * as dracoAdapter from './DracoAdapter';
import { parse as nodeHtmlParser } from 'node-html-parser';

export default class ArticleInfoExtractor {
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

    getAuthor(): string | null {
        if (!this.htmlContentRoot) {
            return null;
        }

        const authorElement = this.htmlContentRoot.querySelectorAll("p, span").find((e: any) => {
            const innerText = e.innerText.trim().toLowerCase().replace(/[\n\r]/g, '').trim();
            const matches = innerText.match(/edited\s*by|by|written\s*by|author/g);

            if (matches && matches.length > 0) {
                return true;
            }

            return false;
        });

        if (authorElement) {
            const authorText = authorElement.innerText.trim();
            
            const cleanAuthorText = authorText
                .toLowerCase()
                .replace(/(edited\s*by|by|written\s*by|author)/g, '')
                .replace(/[^a-zA-Z\s]/g, '')
                .trim();

            const authorNameParts = cleanAuthorText.split(/\s+/);
            let finalName = cleanAuthorText;

            if (authorNameParts.length >= 2) {
                const lastName = authorNameParts.pop()!;
                const firstName = authorNameParts.join(' ');
                finalName = `${firstName} ${lastName}`;
            }
            return finalName.length >= 30 ? null : cleanAuthorText;
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

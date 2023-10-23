import * as dracoAdapter from "./DracoAdapter";
import { parse as nodeHtmlParser } from "node-html-parser";

export default class ArticleInfoExtractor {
  private url: string;
  private query: string;
  private htmlContentRoot: any;

  constructor(url: string) {
    this.url = url;
    this.query = `VAR data = FETCH "${url}" CACHE 6e5 "./" AS HTML`;
    this.htmlContentRoot = null;
  }

  async setHeadless() {
    this.query = `VAR data = FETCH "${this.url}" CACHE 6e5 "./" AS HTML HEADLESS`;
    await this.setup();
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

    const descriptionElement = this.htmlContentRoot
      .querySelectorAll("p")
      .filter((e: any) => {
        const innerText = e.innerText.replace(/[\n\r]/g, "").trim();
        return innerText.length > 250;
      })
      .map((e: any) => e.innerText.trim());

    return descriptionElement.length > 0 ? descriptionElement.join(" ") : null;
  }

  getAuthor(): string | null {
    if (!this.htmlContentRoot) {
      return null;
    }

    const authorElement = this.htmlContentRoot
      .querySelectorAll("p, span")
      .find((e: any) => {
        const innerText = e.innerText
          .trim()
          .replace(/[\n\r]/g, "")
          .trim();
        const matches = innerText.match(/edited\s*by|by|written\s*by|author/g);

        if (matches && matches.length > 0) {
          return true;
        }

        return false;
      });

    if (authorElement) {
      const authorText = authorElement.innerText.trim();
      return authorText;
    }

    return null;
  }

  getPublishedAt(): string | null {
    if (!this.htmlContentRoot) {
      return null;
    }

    const dateRegex = /(\w{3} \d{1,2}, \d{4} \d{1,2}:\d{2} [APap][Mm] \w{3})/;

    const dateString = Array.from(
      this.htmlContentRoot.querySelectorAll("p, span, div")
    )
      .map((e: any) => e.innerText.trim().replace(/\r\n/g, ""))
      .find((e) => e.match(dateRegex));

    return dateString || null;
  }

  getPublishedAt_old(): string | null {
    if (!this.htmlContentRoot) {
      return null;
    }

    const dateRegex =
      /(Published|Updated)(:| At) (\w+ \d{1,2}, \d{4} \d{1,2}:\d{2} [APap][Mm] \w+)/;

    const dateString = Array.from(
      this.htmlContentRoot.querySelectorAll("p, span")
    )
      .map((e: any) => e.innerText.trim().replace(/\r\n/g, ""))
      .find((e) => e.match(dateRegex))
      ?.replace(/(Updated|Published):\s*/, "");

    return dateString ?? null;
  }
}

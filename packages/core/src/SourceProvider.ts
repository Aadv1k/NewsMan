import path from "node:path";
import fs from "node:fs/promises";
import * as utils from "./utils";

export interface NewsSrc {
  domain: string;
  countryCode: string;
  languageCode: string;
  sourceCode: string;
}

class NewsSource {
  sources: Map<string, NewsSrc>;

  constructor() {
    this.sources = new Map();
  }

  async registerFromFile(filepath: string) {
    const fname = path.basename(filepath);
    const parsedFileName = utils.parseDqlFileName(fname);
    if (!parsedFileName) throw new Error('Unable to parse the name, incorrect format');

    const content = await fs.readFile(filepath, 'utf-8');

    if (!content.trim()) throw new Error('Empty file content');

    this.sources.set(parsedFileName.domain, {
      domain: parsedFileName.domain,
      countryCode: parsedFileName.country,
      sourceCode: content,
      languageCode: parsedFileName.language,
    });
  }

  async registerFromDir(dirpath: string) {
    const fnames = await fs.readdir(dirpath);
    for (const fname of fnames) {
      const filePath = path.join(dirpath, fname);

      await this.registerFromFile(filePath);
    }
  }

  async register(source: NewsSrc) {
    this.sources.set(source.domain, {
      domain: source.domain,
      countryCode: source.countryCode,
      sourceCode: source.sourceCode,
      languageCode: '',
    });
  }
}

const SourceProvider = new NewsSource();

export default SourceProvider;

import * as draco from "dracoql";
import assert from 'node:assert';

import path from "node:path";
import fs from "node:fs";

export interface News {
  title: string;
  description: string;
  url: string;
}

export interface ProviderConfig {
    maxItems?: number,
    excludeSites?: Array<string>
}


const HEADLINE_SOURCE_PATH = "./dql/headlines";
const DQL_EXTENSION = ".dql";

export default class NewsProvider {
  fetchHeadlines(config: ProviderConfig): News[] {
     const files = fs.readdirSync(HEADLINE_SOURCE_PATH);
     assert.equal(files.length, 0, `Atleast one DracoQL file is expected in ${HEADLINE_SOURCE_PATH}`);

      for (const fileName of files) {
          if (!fileName.endsWith(DQL_EXTENSION)) continue;

          const fileContent = fs.readFileSync(path.join(__dirpath, HEADLINE_SOURCE_PATH, fileName), "utf-8");
          const fetchedData = await new Promise((resolve, reject) => {
              draco.eval(fileContent, resolve);
          })
      }
    })

  }
}

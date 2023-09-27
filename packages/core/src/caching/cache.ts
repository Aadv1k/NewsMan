import { News } from "../types";

import LocalCache from "./LocalCache";

export interface Cache {
  store: (data: Array<News>) => Promise<void>;
  isFresh: () => Promise<boolean>;
  fetch: () => Promise<Array<News>>;
}

export default function cacheFactory(cacheType: string, config?: any): Cache {
  switch (cacheType) {
    case "local":
      return new LocalCache(config);
    default:
      throw new Error(`ERROR cacheFactory unimplemented cache type ${cacheType}`);
  }
}


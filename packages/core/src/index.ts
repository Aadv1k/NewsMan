import NewsProvider from "./NewsAggregator"
import cacheFactory from "./caching/cache";

const provider = new NewsProvider();
const cache = cacheFactory("local", {
  cacheFilePath: ".index-cache.json";
});

export async function getHeadlines() {
  if (cache.isFresh()) {
    return cache.fetch();
  } 

  const data = await NewsProvier.fetchHeadlines();
  cache.store(data)

  return data;
}

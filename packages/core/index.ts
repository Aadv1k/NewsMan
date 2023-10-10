import provider from "./src/";
import cacheFactory from "./src/";

const cache = cacheFactory("local", {
    path: "./.newsman-cache"
}) 


(async () => {
    cache.get("news.tv")

    await provider.fetchAllHeadlines({});
})();

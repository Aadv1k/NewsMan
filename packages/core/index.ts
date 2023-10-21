import provider from "./src/";
import cacheFactory from "./src/";

(async () => {
    await provider.fetchAllHeadlines({});
})();

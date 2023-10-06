import provider from "./src/";
import cacheFactory from "./src/";

(async () => {
    console.log(await provider.fetchAllHeadlines({}));
})();

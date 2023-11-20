import { fetchHeadlines } from "./src/";
import { LocalCache } from "./src/cache";

(async () => {
    const cache = new LocalCache(6e5);

    const articles = await fetchHeadlines({
        excludeDomains: [],
        countryCode: ""
    }, cache);

    console.log(JSON.stringify(articles, null, 2));
})();

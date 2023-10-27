import { fetchHeadlines } from "./src/";
import { LocalCache } from "./src/cache";

(async () => {
    const cache = new LocalCache();

    const articles = await fetchHeadlines({
        excludeDomains: [],
        countryCode: "in"
    }, cache);
})();

import { fetchHeadlines } from "./src/";
import { LocalCache } from "./src/cache";

(async () => {
    const cache = new LocalCache(5);

    const articles = await fetchHeadlines({
        excludeDomains: ["ndtv.com", "india.com", "indianexpress.com"],
        countryCode: "in"
    }, cache);

    console.log(articles);
})();

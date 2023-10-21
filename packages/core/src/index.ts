import NewsProvider from "./NewsProvider";
import path from "node:path";

export { NewsArticle } from "./NewsProvider";

const provider = new NewsProvider(
  path.join(__dirname, "../dql/headlines"), // headline dir path
  undefined, // everything dir path 
  "in" // default country code
);


(async () => {
    console.log(await provider.fetchAllHeadlines({
        excludeDomains: [],
    }));
})()

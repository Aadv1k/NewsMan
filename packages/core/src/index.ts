import NewsProvider from "./NewsProvider";
import path from "node:path";

export { NewsArticle } from "./NewsProvider";

export default new NewsProvider(
  path.join(__dirname, "../dql/headlines"), // headline dir path
  undefined, // everything dir path 
  "in" // default country code
);

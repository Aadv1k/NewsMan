import NewsProvider from "../src/NewsAggregator";
import path from "node:path";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider(
        path.join(__dirname, "../dql/headlines"), // headline dir path
        undefined, // everything dir path 
        "in" // default country code
    );

    test("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test("Should get the latest news specified by the region", async () => {
        const data = await provider.fetchHeadlines({ countryCode: "in" });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

})

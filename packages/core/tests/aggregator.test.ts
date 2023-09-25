import NewsProvider from "../src/NewsAggregator";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider();
    test("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test("Should get the latest news specified by the region", async () => {
        const data = await provider.fetchHeadlines({ countryCode: "in" });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

})

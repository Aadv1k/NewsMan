import NewsProvider, { ProviderConfig } from "../src/NewsAggregator";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider();
    test("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
        expect(data.length).toBe(10);
    });

    test.skip("Should get the latest news specified by the region", async () => {
        const data = await provider.fetchNewsByRegion("IN")
        const data2 = await provider.fetchNewsByRegion("US")

        expect(data.length).toBeGreaterThan(1);
        expect(data2.length).toBeGreaterThan(1);
    });

    test.skip("Should exclude the specified news sites", async () => {
        const data = await provider.fetchNews();
        expect(data.length).toBeGreaterThan(1);
    });

    test.todo("Should exclude the news if headlines contains keywords");
})

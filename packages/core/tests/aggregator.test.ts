import NewsProvider from "../src/NewsAggregator";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider();
    test.skip("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test("Should get the latest news specified by the region", async () => {
        const data = await provider.fetchHeadlines({ region: "in" });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test.todo("Should exclude the specified news sites");
    test.todo("Should exclude the news if headlines contains keywords");
})

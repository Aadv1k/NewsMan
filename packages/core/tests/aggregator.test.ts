import NewsProvider, { ProviderConfig } from "../src/NewsAggregator";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider();
    test("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
    });

    test.todo("Should get the latest news specified by the region");
    test.todo("Should exclude the specified news sites");
    test.todo("Should exclude the news if headlines contains keywords");
})

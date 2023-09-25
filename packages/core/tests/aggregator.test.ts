import NewsProvider from "../src/NewsAggregator";

describe("Tests for the Aggregator", () => {
    const provider = new NewsProvider();
    test("Should get the top 10 global headlines", async () => {
        const data = await provider.fetchHeadlines({ maxItems: 10 });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test("Should get the latest news specified by the region", async () => {
        const data = await provider.fetchHeadlines({ region: "in" });
        expect(data.length).toBeGreaterThan(0);
    }, 15000);

    test("Should include the news if headlines contains keywords", async () => {
        const keywords = ["BJP", "Delhi", "Schools"];
        const data = await provider.fetchHeadlines({ region: "in", keywords, });
        expect(data.every((elem: any) => keywords.some((keyword: string) => elem.title.toLowerCase().includes(keyword.toLowerCase())))).toBe(true);
    }, 15000);
})

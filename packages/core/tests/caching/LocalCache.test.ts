import LocalCache from "../../src/caching/LocalCache";

const exampleNewsData = [
  {
    "title": "Tech Company Announces New Product Launch",
    "url": "https://example.com/article/1",
    "source": "Example News",
    "description": "A tech company unveiled their latest product in a press conference.",
    "publishedAt": "2023-09-20T15:30:00Z",
    "urlToImage": "https://example.com/images/product-launch.jpg"
  },
  {
    "title": "Stock Market Hits Record High",
    "url": "https://example.com/article/2",
    "source": "Financial Times",
    "description": "The stock market reached an all-time high, driven by strong earnings reports.",
    "publishedAt": "2023-09-21T09:15:00Z",
    "urlToImage": "https://example.com/images/stock-market.jpg"
  },
  {
    "title": "New Scientific Discovery",
    "url": "https://example.com/article/3",
    "source": "Science Daily",
    "description": "Scientists made a groundbreaking discovery in the field of astrophysics.",
    "publishedAt": "2023-09-22T12:45:00Z",
    "urlToImage": "https://example.com/images/scientific-discovery.jpg"
  },
  {
    "title": "Entertainment News: Actor Wins Award",
    "url": "https://example.com/article/4",
    "source": "Entertainment Weekly",
    "description": "A renowned actor received a prestigious award for their outstanding performance.",
    "publishedAt": "2023-09-23T18:20:00Z",
    "urlToImage": "https://example.com/images/award-actor.jpg"
  },
  {
    "title": "Environmental Update: Climate Change Report",
    "url": "https://example.com/article/5",
    "source": "National Geographic",
    "description": "A new climate change report highlights the urgency of addressing environmental challenges.",
    "publishedAt": "2023-09-24T14:10:00Z",
    "urlToImage": "https://example.com/images/climate-change-report.jpg"
  }
]


describe("Tests for the Local cache", () => {
    const localCache = new LocalCache({
        cacheFilePath: ".test-cache.json"
    })
    it("Should cache the given data", async () => {
        await localCache.store(exampleNewsData)
    });

    it("Should load the given data", async () => {
        await localCache.fetch()
    });

    it("Should be able to check for freshness", async () => {
        await localCache.isFresh();
    })
})

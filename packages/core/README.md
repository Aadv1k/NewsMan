# @newsman/core

The `@newsman/core` library provides a system for fetching, parsing, sanitizing, and caching news data.

## Installation

```bash
npm install @newsman/core
# or
yarn add @newsman/core
# or
pnpm add @newsman/core
```

## Usage

Here is the most basic example to fetch the headlines

```typescript
import * as NewsMan from "@newsman/core";

(async () => {
    const articles = await NewsMan.fetchHeadlines({
        excludeDomains: [],
        countryCode: "in"
    });
})
```

### Output (Truncated)

The `fetchHeadlines()` function returns an array of JSON objects, each of which represents a news article. The JSON objects have the following fields:

* `title`: The title of the article.
* `url`: The URL of the article.
* `urlToImage`: The URL of the image associated with the article.
* `source`: The source of the article.
* `description`: A brief description of the article.
* `publishedAt`: The date and time the article was published.

For example, the following is a sample output of the `fetchHeadlines()` function:

```typescript
[
  {
    title: 'Maritime sector should adapt to climate change: President Murmu',
    url: 'https://hindustantimes.com//india-news/maritime-sector-should-adapt-to-climate-change-president-murmu-101698403224006.html',
    urlToImage: 'https://www.hindustantimes.com/ht-img/img/2023/10/27/150x84/President-Droupadi-Murmu-graced-the-8th-convocatio_1698403218021.jpg',
    source: 'hindustantimes.com',
    description: "Speaking on the occasion, the President said that India has a remarkable marine position with a 7,500 km long coastline. She added that India has 14,500 kilometres of potentially navigable waterways, apart from a strategic location on important maritime trade routes... (truncated) [+530 chars]",
    publishedAt: null
  },
  {
    title: "Law for OPS, laptop for college students, cow dung at ₹2/kg among Gehlot's 5 guarantees",
    url: 'https://hindustantimes.com//india-news/law-for-ops-laptop-for-college-students-cow-dung-at-rs-2-kg-among-gehlots-5-guarantees-101698398424698.html',
    urlToImage: 'https://www.hindustantimes.com/ht-img/img/2023/10/27/148x111/ashok_gehlot_rajasthan_congress_poll_promise_1698398563839_1698398564113.jpg',
    source: 'hindustantimes.com',
    description: "Rajasthan chief minister Ashok Gehlot on Friday announced five guarantees for the people of the state, including a law on the Old Pension Scheme and buying cow dung at ₹2 per kg. Among other electoral promises... (truncated) [+530 chars]",
    publishedAt: null
  },
  {
    title: "Mahua Moitra says want to 'cross-examine' Darshan Hiranandani, demands list of alleged gifts",
    url: 'https://hindustantimes.com//india-news/mahua-moitra-says-want-to-cross-examine-darshan-hiranandani-demands-list-of-alleged-gifts-101698399539637.html',
    urlToImage: 'https://www.hindustantimes.com/ht-img/img/2023/10/27/148x111/ANI-20230810024-0_1698399789548_1698399816949.jpg',
    source: 'hindustantimes.com',
    description: `New Delhi: Trinamool Congress MP Mahua Moitra on Friday told the Ethics Committee of Lok Sabha that businessman Darshan Hiranandani's recent affidavit against her was “scant on detail and provides no actual inventory”... (truncated) [+530 chars]",
    publishedAt: null
  }
]
```

## Sources

The system works by looping and parsing through a dir of `.dql` file, which corresponds to [DracoQL](https://github.com/aadv1k/DracoQL) query file

Here is the directory structure of [./dql/headlines](./dql/headlines)

```
hindustantimes.com_en_in.dql
india.com_en_in.dql
indianexpress.com_en_in.dql
ndtv.com_en_in.dql
```

Here each file corresponds to a particular site, along with some meta about it. If this kind of format is not found the file is ignored and not considered.

```typescript
{Domain}_{Language}_{Country}.dql
```

Each file is run using `draco.eval()`, we use the info extracted from the file to further scrap the details about the article, this is also done using DracoQL's inline-scripting functionality, and the clean data is returned, the filters provided also apply during this process, so excluding sites makes the process faster.

## Examples

```typescript
// Fetch the headlines from all news sources in India
const articles = await NewsMan.fetchHeadlines({
  countryCode: "in"
});

// Fetch the headlines from all news sources in India, excluding the `ndtv.com` domain
const articles = await NewsMan.fetchHeadlines({
  countryCode: "in",
  excludeDomains: ["ndtv.com"]
});

// Fetch the headlines from the specified news sources in India, and cache the results for 1 hour
const cache = new LocalCache(60 * 60 * 1000);

const articles = await NewsMan.fetchHeadlines({
  countryCode: "in",
}, cache);
```


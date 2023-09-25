# NewsMan

is a customizable, self-hostable alternative to [NewsAPI](https://newsapi.org/)

> **How does it work?**
> NewsMan works as a web-scraper, but not directly, it uses [DracoQL](https://github.com/aadv1k/dracoql) to handle much of the heavy lifting, 
> and to make the system more modular. The core simply assembles the data into a coherent format


## Usage

This [PNPM](https://pnpm.io/) Monorepo houses the [@newsman/core](./packages/core) and (todo) @newsman/app

### [@newsman/core](./packages/core)

This package can be used as-is, it handled the logic for data aggregation, via DracoQL and (todo) caching, which can be local, SQL or MongoDB

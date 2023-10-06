import provider from "./src/";

(async () => {
    console.log(await provider.fetchHeadlines());
})();
